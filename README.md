# TheCanvasV1

A collaborative pixel art platform inspired by r/place, where users can draw on a shared canvas for all to see! Built with modern web technologies and integrated with Roblox.

This project is made to be used with the [TheCanvasV1 Roblox game](https://github.com/Altie122/thecanvasv1).

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![Convex](https://img.shields.io/badge/Convex-1.25.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)

## 🎨 Features

- **Collaborative Pixel Art**: Real-time collaborative drawing on a 120x120 pixel grid
- **Live Updates**: See changes from other users instantly
- **Roblox Integration**: Connected to Roblox DataStore for cross-platform functionality
- **Moderation System**: Built-in moderation mode for maintenance
- **Responsive Design**: Works on desktop and mobile devices
- **Image Generation**: Automatic generation of canvas images for social sharing
- **User Tracking**: Optional user ID tracking for pixel attribution

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (real-time database and functions)
- **File Storage**: UploadThing
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI, Lucide React icons
- **Image Processing**: Sharp
- **Package Manager**: pnpm
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Recommended latest LTS)
- pnpm 9.15.1+ (Recommended latest LTS)
- Convex account
- Roblox API key & universe ID

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Altie122/thecanvasv1website.git
   cd thecanvasv1website
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory based on the `.env.example` file. You may remove the production variables if working in local development.

4. **Set up Convex**

   ```bash
   pnpm convex dev
   ```

   This will start the Convex development server and provide you with a URL to use in your environment variables. You many end this process once you are signed in as it is run with `pnpm dev` automatically.

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
thecanvasv1website/
├── convex/                 # Convex backend functions and schema
│   ├── schema.ts          # Database schema definition
│   ├── pixels.ts          # Pixel-related queries and mutations
│   └── mod.ts             # Moderation mode functions
├── src/
│   ├── app/               # Next.js app router
│   │   ├── api/           # API routes
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   │   ├── widgets/       # Main application widgets
│   │   │   └── grid/      # Grid and cell components
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utility functions
│   │   └── generateimage.ts # Canvas image generation
│   └── styles/            # Global styles
├── scripts/               # Utility scripts
└── package.json           # Dependencies and scripts
```

## 🎯 Core Features Explained

### Collaborative Grid

- 120x120 pixel grid where users can place colored pixels
- Real-time updates using Convex subscriptions
- Each pixel stores color and user ID

### Moderation Mode

- Toggle-able moderation mode for maintenance
- When enabled, displays maintenance message instead of the canvas
- Controlled via Convex database

### Image Generation

- Automatic generation of canvas images for social media
- Integrates with Roblox DataStore for cross-platform data
- Uses Sharp for high-quality image processing

### API Endpoints

- `/api/pixel` - Update individual pixels (authenticated with Create API key)
- `/api/image` - Generate canvas images (unauthenticated)
- `/api/create/hourly` - Hourly data processing (authenticated with Create API key)

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically detect Next.js and deploy

### Manual Deployment

1. **Build the project**

   ```bash
   pnpm build
   ```

2. **Start production server**
   ```bash
   pnpm start
   ```

## 🔧 Development Scripts

```bash
# Development
pnpm dev              # Start development servers (Convex + Next.js)
pnpm dev:next         # Start only Next.js dev server
pnpm dev:convex       # Start only Convex dev server

# Building
pnpm build            # Build for production
pnpm build:local      # Build Next.js locally

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm typecheck        # Run TypeScript type checking
pnpm format:write     # Format code with Prettier
pnpm format:check     # Check code formatting

# Database
pnpm convex           # Run Convex CLI commands
```

## Optional:
- Included in this repository is a file called `export.122` this file is a dump of the official TheCanvasV1 production database. This is not required but may be useful for development purposes. NEVER push this file to your production database as it will create different data than what is on the roblox servers.
  - To import this file into your production database, you will need to run the following commands:
    - `pnpm convex import export.122`

## Fun Addition You Can Do
- Snapshot gallery, where users can view snapshots of TheCanvas without needing discord

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [r/place](https://reddit.com/r/place)
- Built with [Convex](https://convex.dev) for real-time functionality
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Made with ❤️ by Altie122 Studios**