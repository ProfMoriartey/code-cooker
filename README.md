# Code Cooker - QR Code Generator

A modern, feature-rich QR code generator web application built with Next.js 15, TypeScript, and Tailwind CSS. Create, customize, and manage both static and dynamic QR codes with a beautiful, responsive interface.

## 🚀 Features

### Core Functionality

- **Static QR Codes**: Generate QR codes for text, URLs, email, phone, SMS, and WiFi credentials
- **Dynamic QR Codes**: Create QR codes that redirect to custom URLs with tracking capabilities
- **Custom Styling**: Full color customization with foreground and background color pickers
- **User Authentication**: Secure login with NextAuth.js supporting multiple providers
- **QR Code Management**: Save, edit, and delete your generated QR codes
- **Scan Analytics**: Track scan counts for dynamic QR codes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### QR Code Types Supported

- **Text**: Plain text content
- **URL**: Website links
- **Email**: Email addresses with optional subject and body
- **Phone**: Phone numbers for direct calling
- **SMS**: Text messages with pre-filled content
- **WiFi**: Network credentials (SSID, password, encryption type)

### User Experience

- **Intuitive Interface**: Clean, modern UI with step-by-step guidance
- **Real-time Preview**: See your QR code as you customize it
- **Instant Generation**: Fast QR code creation with immediate display
- **Mobile-Friendly**: Optimized for all screen sizes
- **Accessibility**: Built with accessibility best practices

## 🛠️ Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons
- **React Colorful**: Color picker component

### Backend & Database

- **NextAuth.js 5**: Authentication framework
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Reliable database storage
- **Nanoid**: Unique ID generation

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Drizzle Kit**: Database migrations and management

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or pnpm package manager

### 1. Clone the Repository

```bash
git clone <repository-url>
cd code-cooker
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/code_cooker"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 4. Database Setup

```bash
# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## 📱 Usage

### Creating QR Codes

1. **Sign Up/Login**: Create an account or sign in with your existing credentials
2. **Navigate to Dashboard**: Access the QR code generator from the dashboard
3. **Choose QR Type**: Select from text, URL, email, phone, SMS, or WiFi
4. **Enter Content**: Fill in the required information for your chosen type
5. **Customize Appearance**: Use the color pickers to customize foreground and background colors
6. **Generate**: Click "Generate & Save QR Code" to create and save your QR code

### Dynamic QR Codes

1. **Enable Dynamic Mode**: Toggle the dynamic option in the form
2. **Enter Target URL**: Specify the URL where users will be redirected
3. **Generate**: Create a dynamic QR code with tracking capabilities
4. **Share**: Share the generated QR code - scans will redirect to your target URL

### Managing QR Codes

- **View Saved Codes**: Access your saved QR codes from the dashboard
- **Edit Codes**: Modify existing QR codes (title, colors, content)
- **Delete Codes**: Remove unwanted QR codes
- **Download**: Save QR codes as images for offline use

## 🏗️ Project Structure

```
code-cooker/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── api/               # API routes
│   │   └── qr/               # Dynamic QR redirect routes
│   ├── components/            # React components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── ui/               # Reusable UI components
│   │   └── shared/           # Shared components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and types
│   ├── server/               # Server-side code
│   │   ├── auth/             # Authentication configuration
│   │   └── db/               # Database schema and connection
│   └── styles/               # Global styles
├── drizzle/                  # Database migrations
├── public/                   # Static assets
└── package.json
```

## 🔧 Configuration

### Database Schema

The application uses a PostgreSQL database with the following main tables:

- **users**: User authentication data
- **accounts**: OAuth account connections
- **sessions**: User sessions
- **qr_codes**: QR code data with support for both static and dynamic codes

### Authentication

The app supports multiple authentication providers through NextAuth.js:

- Email/Password
- Google OAuth
- GitHub OAuth
- Custom providers can be easily added

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

**Code Cooker** - Making QR code generation simple, beautiful, and powerful. 🎯
