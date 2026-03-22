export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
};

export function getAuthErrorMessage(code: string | null): string {
  switch (code) {
    case 'access_denied':
      return '你取消了 Google 登录，请重试。';
    case 'state_mismatch':
      return '登录校验失败，请重新发起 Google 登录。';
    case 'missing_code':
      return 'Google 未返回授权码，请重试。';
    case 'login_failed':
      return 'Google 登录失败，请检查配置后重试。';
    case 'auth_unavailable':
      return '登录服务暂时不可用，请稍后重试。';
    default:
      return '登录过程中发生错误，请稍后重试。';
  }
}
