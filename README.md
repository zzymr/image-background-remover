# Image Background Remover

AI-powered image background removal web application using remove.bg API.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Remove.bg API key ([Get one here](https://www.remove.bg/api))
  - Free tier: 50 images/month
  - Paid: $0.20/image

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Remove.bg API key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
image-background-remover/
├── app/
│   ├── api/
│   │   └── remove-background/
│   │       └── route.ts          # API endpoint for background removal
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page
├── components/
│   ├── ImageUploader.tsx          # Drag & drop upload component
│   └── ProcessingResult.tsx       # Result preview and processing
├── .env.example                   # Environment variables template
├── .env.local                     # Your actual environment variables (not in git)
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Features

- ✅ Drag & drop image upload
- ✅ Support for: PNG, JPG, JPEG, WEBP (max 10MB)
- ✅ Real-time background removal using AI
- ✅ Download processed images (PNG with transparency)
- ✅ Error handling for API limits and network issues
- ✅ Responsive design for mobile and desktop
- ⏳ Batch processing (planned)
- ⏳ Custom background replacement (planned)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required
REMOVE_BG_API_KEY=your_api_key_here

# Optional (default: https://api.remove.bg/v1.0/removebg)
REMOVE_BG_API_URL=https://api.remove.bg/v1.0/removebg
```

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** TailwindCSS
- **AI Service:** remove.bg API
- **Deployment:** Vercel (recommended)

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `REMOVE_BG_API_KEY`: Your remove.bg API key
4. Deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📄 API Documentation

### POST /api/remove-background

Remove background from an image.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `image`: File (required)

**Response:**
```json
{
  "success": true,
  "image": "data:image/png;base64,...",
  "size": 12345
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## 🔒 Security

- API keys are stored in environment variables (not in code)
- File size limit: 10MB
- File type validation
- Error handling for API rate limits

## 📈 Monitoring

The app includes error tracking for:
- API failures
- Rate limit exceeded
- Invalid API key
- File validation errors

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT
