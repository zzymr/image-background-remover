# Image Background Remover

A modern web application for removing image backgrounds using AI. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✨ **Instant Background Removal** - Remove backgrounds in seconds using Remove.bg AI
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 📊 **Comparison View** - Slide to compare original vs processed image
- 🚀 **Fast & Efficient** - Edge runtime with global CDN
- 🔒 **Privacy First** - Images processed through secure API
- 📱 **Mobile Friendly** - Works perfectly on all devices

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Lucide icons
- **API:** Remove.bg API for background removal
- **Deployment:** Cloudflare Pages (Edge Runtime)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Remove.bg API key ([Get free API key](https://www.remove.bg/api))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd image-background-remover
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Remove.bg API key to `.env.local`:
```env
REMOVEBG_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
image-background-remover/
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts       # API endpoint for background removal
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── components/
│   ├── ImageUploader.tsx      # File upload component
│   └── ProcessingResult.tsx    # Processing result component
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## API Endpoints

### POST /api/remove-bg

Remove background from an image.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: image file

**Response:**
- Success: PNG image with removed background
- Error: JSON object with error message

**Example:**
```bash
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "image=@your-image.jpg" \
  http://localhost:3000/api/remove-bg \
  --output result.png
```

## Deployment

### Cloudflare Pages (Recommended)

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy:
```bash
npm run build
wrangler pages deploy .env
```

4. Set your API key in Cloudflare Dashboard:
   - Go to your project settings
   - Add environment variable: `REMOVEBG_API_KEY`

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add `REMOVEBG_API_KEY` in environment variables
4. Deploy

## API Usage

### Remove.bg Free Tier

- 50 credits/month
- 12 megapixels/image
- Standard processing speed

### Remove.bg Paid Plans

- **Monthly:** $9/month for 40 credits
- **Pay-as-you-go:** $0.20/image
- See [Remove.bg Pricing](https://www.remove.bg/pricing) for details

## Features Roadmap

- [ ] Batch processing (multiple images)
- [ ] Background replacement options
- [ ] Edge refinement controls
- [ ] History/local storage
- [ ] Cloud storage integration
- [ ] API for developers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check Remove.bg [documentation](https://www.remove.bg/api)

## Acknowledgments

- [Remove.bg](https://www.remove.bg/) - AI background removal API
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons

---

Built with ❤️ using Next.js and Remove.bg
