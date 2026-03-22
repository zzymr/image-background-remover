import 'server-only';

import { getRequestContext } from '@cloudflare/next-on-pages';
import type { NextRequest } from 'next/server';

import type { SessionUser } from '@/lib/auth-shared';

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_ENDPOINT =
  'https://openidconnect.googleapis.com/v1/userinfo';

export const SESSION_COOKIE_NAME = 'bgremover_session';
export const OAUTH_STATE_COOKIE_NAME = 'bgremover_google_state';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const OAUTH_STATE_TTL_SECONDS = 60 * 10;

const GOOGLE_SCOPES = ['openid', 'email', 'profile'].join(' ');

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
};

type SessionQueryRow = SessionUser & {
  session_id: string;
};

function getDb(): D1Database {
  const { env } = getRequestContext();

  if (!env.DB) {
    throw new Error('Cloudflare D1 binding "DB" is not configured.');
  }

  return env.DB;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export function isAuthConfigured(): boolean {
  try {
    getRequiredEnv('GOOGLE_CLIENT_ID');
    getRequiredEnv('GOOGLE_CLIENT_SECRET');
    getRequiredEnv('SESSION_SECRET');
    return Boolean(getDb());
  } catch {
    return false;
  }
}

export function isSecureRequest(request: NextRequest): boolean {
  return new URL(request.url).protocol === 'https:';
}

function getNowUnix(): number {
  return Math.floor(Date.now() / 1000);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function randomBase64Url(bytes = 32): string {
  const random = new Uint8Array(bytes);
  crypto.getRandomValues(random);
  return arrayBufferToBase64Url(random.buffer);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function signToken(value: string): Promise<string> {
  const secret = getRequiredEnv('SESSION_SECRET');
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(value)
  );

  return arrayBufferToBase64Url(signature);
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export function getGoogleCallbackUrl(request: NextRequest): string {
  const url = new URL(request.url);
  return `${url.origin}/api/auth/google/callback`;
}

export function getGoogleAuthorizationUrl(
  request: NextRequest,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: getRequiredEnv('GOOGLE_CLIENT_ID'),
    redirect_uri: getGoogleCallbackUrl(request),
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    state,
    prompt: 'select_account',
    access_type: 'offline',
    include_granted_scopes: 'true',
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

export async function exchangeCodeForGoogleUser(
  request: NextRequest,
  code: string
): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: getRequiredEnv('GOOGLE_CLIENT_ID'),
      client_secret: getRequiredEnv('GOOGLE_CLIENT_SECRET'),
      redirect_uri: getGoogleCallbackUrl(request),
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google token exchange failed: ${errorText}`);
  }

  const tokenData = (await response.json()) as {
    access_token?: string;
  };

  if (!tokenData.access_token) {
    throw new Error('Google access token missing from token response.');
  }

  const userInfoResponse = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!userInfoResponse.ok) {
    const errorText = await userInfoResponse.text();
    throw new Error(`Google user info request failed: ${errorText}`);
  }

  const profile = (await userInfoResponse.json()) as GoogleUserInfo;

  if (!profile.sub || !profile.email) {
    throw new Error('Google user profile is missing required fields.');
  }

  return profile;
}

export async function upsertGoogleUser(
  profile: GoogleUserInfo
): Promise<SessionUser> {
  if (!profile.sub || !profile.email) {
    throw new Error('Google profile is incomplete.');
  }

  const db = getDb();
  const now = getNowUnix();

  const existingUser = await db
    .prepare(
      `SELECT id
       FROM users
       WHERE google_sub = ? OR email = ?
       LIMIT 1`
    )
    .bind(profile.sub, profile.email)
    .first<{ id: string }>();

  const userId = existingUser?.id ?? crypto.randomUUID();
  const name = profile.name ?? profile.email;
  const givenName = profile.given_name ?? null;
  const familyName = profile.family_name ?? null;
  const picture = profile.picture ?? null;
  const locale = profile.locale ?? null;
  const emailVerified = profile.email_verified ? 1 : 0;

  if (existingUser) {
    await db
      .prepare(
        `UPDATE users
         SET google_sub = ?,
             email = ?,
             email_verified = ?,
             name = ?,
             given_name = ?,
             family_name = ?,
             picture = ?,
             locale = ?,
             updated_at = ?,
             last_login_at = ?
         WHERE id = ?`
      )
      .bind(
        profile.sub,
        profile.email,
        emailVerified,
        name,
        givenName,
        familyName,
        picture,
        locale,
        now,
        now,
        userId
      )
      .run();
  } else {
    await db
      .prepare(
        `INSERT INTO users (
          id,
          google_sub,
          email,
          email_verified,
          name,
          given_name,
          family_name,
          picture,
          locale,
          created_at,
          updated_at,
          last_login_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        userId,
        profile.sub,
        profile.email,
        emailVerified,
        name,
        givenName,
        familyName,
        picture,
        locale,
        now,
        now,
        now
      )
      .run();
  }

  const user = await db
    .prepare(
      `SELECT id, email, name, picture
       FROM users
       WHERE id = ?
       LIMIT 1`
    )
    .bind(userId)
    .first<SessionUser>();

  if (!user) {
    throw new Error('Failed to load user after Google sign-in.');
  }

  return user;
}

async function cleanupExpiredSessions(): Promise<void> {
  const db = getDb();

  await db
    .prepare('DELETE FROM sessions WHERE expires_at <= ?')
    .bind(getNowUnix())
    .run();
}

export async function createUserSession(
  userId: string,
  request: NextRequest
): Promise<{ cookieValue: string; expiresAt: number; maxAge: number }> {
  await cleanupExpiredSessions();

  const db = getDb();
  const rawToken = randomBase64Url(32);
  const signature = await signToken(rawToken);
  const sessionTokenHash = await sha256Hex(rawToken);
  const sessionId = crypto.randomUUID();
  const now = getNowUnix();
  const expiresAt = now + SESSION_TTL_SECONDS;
  const ipAddress = request.headers.get('cf-connecting-ip');
  const userAgent = request.headers.get('user-agent');

  await db
    .prepare(
      `INSERT INTO sessions (
        id,
        user_id,
        session_token_hash,
        created_at,
        last_seen_at,
        expires_at,
        ip_address,
        user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      sessionId,
      userId,
      sessionTokenHash,
      now,
      now,
      expiresAt,
      ipAddress,
      userAgent
    )
    .run();

  return {
    cookieValue: `${rawToken}.${signature}`,
    expiresAt,
    maxAge: SESSION_TTL_SECONDS,
  };
}

async function readRawSessionToken(
  cookieValue: string | undefined
): Promise<string | null> {
  if (!cookieValue) {
    return null;
  }

  const [rawToken, signature] = cookieValue.split('.');

  if (!rawToken || !signature) {
    return null;
  }

  const expectedSignature = await signToken(rawToken);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  return rawToken;
}

export async function getCurrentUser(
  request: NextRequest
): Promise<SessionUser | null> {
  const rawToken = await readRawSessionToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value
  );

  if (!rawToken) {
    return null;
  }

  await cleanupExpiredSessions();

  const db = getDb();
  const sessionTokenHash = await sha256Hex(rawToken);
  const now = getNowUnix();

  const row = await db
    .prepare(
      `SELECT
         s.id AS session_id,
         u.id AS id,
         u.email AS email,
         u.name AS name,
         u.picture AS picture
       FROM sessions s
       INNER JOIN users u ON u.id = s.user_id
       WHERE s.session_token_hash = ?
         AND s.expires_at > ?
       LIMIT 1`
    )
    .bind(sessionTokenHash, now)
    .first<SessionQueryRow>();

  if (!row) {
    return null;
  }

  await db
    .prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?')
    .bind(now, row.session_id)
    .run();

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    picture: row.picture,
  };
}

export async function deleteSession(request: NextRequest): Promise<void> {
  const rawToken = await readRawSessionToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value
  );

  if (!rawToken) {
    return;
  }

  const sessionTokenHash = await sha256Hex(rawToken);

  await getDb()
    .prepare('DELETE FROM sessions WHERE session_token_hash = ?')
    .bind(sessionTokenHash)
    .run();
}

export function createStateCookieValue(): string {
  return randomBase64Url(24);
}

export function getCookieOptions(
  request: NextRequest,
  maxAge: number
): {
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax';
  path: '/';
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: isSecureRequest(request),
    sameSite: 'lax',
    path: '/',
    maxAge,
  };
}

export function getStateCookieOptions(request: NextRequest) {
  return getCookieOptions(request, OAUTH_STATE_TTL_SECONDS);
}

export function getSessionCookieOptions(
  request: NextRequest,
  maxAge = SESSION_TTL_SECONDS
) {
  return getCookieOptions(request, maxAge);
}

