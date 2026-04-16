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


// src/app/actions.ts
"use server"; // Mark all functions in this file as server actions

import { auth } from "~/server/auth"; // Import the auth function
import { db } from "~/server/db"; // Import your Drizzle database instance
import { qrCodes, multiPageSets } from "~/server/db/schema"; // Added multiPageSets to imports
import { eq, desc } from "drizzle-orm"; // Added desc to imports
import { QrCodeType, type QRCode, type MultiPageSet } from "~/lib/types"; // Added MultiPageSet to imports
import { customAlphabet } from 'nanoid'; // For generating unique short codes

// Define the input type for creating a static QR code
interface CreateStaticQrCodeInput {
  data: string;
  type: QrCodeType;
  title: string | null;
  foregroundColor: string; // Add foregroundColor
  backgroundColor: string; // Add backgroundColor
}

// Define the input type for creating a dynamic QR code
interface CreateDynamicQrCodeInput {
  title: string | null;
  targetUrl: string; // The URL the dynamic QR code will redirect to
  foregroundColor: string;
  backgroundColor: string;
}

// Helper to generate a unique short code
const generateShortCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

// Server Action to create a new static QR code
export async function createQrCode(input: CreateStaticQrCodeInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated.", details: null, qrCode: null };
  }

  try {
    const [newQrCode] = await db
      .insert(qrCodes)
      .values({
        userId: session.user.id,
        data: input.data,
        type: input.type,
        title: input.title,
        foregroundColor: input.foregroundColor,
        backgroundColor: input.backgroundColor,
        isDynamic: false, // Mark as static
        shortCode: null, // No short code for static
        targetUrl: null, // No target URL for static
        scanCount: 0, // No scan count for static
      })
      .returning();

    if (!newQrCode) {
      return { success: false, error: "Failed to create QR code.", details: null, qrCode: null };
    }

    // Ensure the returned newQrCode object fully matches the QRCode type including colors
    const resultQrCode: QRCode = {
      ...newQrCode,
      createdAt: new Date(newQrCode.createdAt),
      // If 'updatedAt' is not in your schema, remove this line or add it to schema
      // updatedAt: new Date(newQrCode.updatedAt),
    } as QRCode; // Cast to QRCode to ensure type compatibility

    return { success: true, qrCode: resultQrCode, error: null, details: null };
  } catch (error: unknown) {
    console.error("Database error creating static QR code:", error);
    let errorMessage = "An unknown database error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: "Database error.", details: errorMessage, qrCode: null };
  }
}

// Server Action to create a new dynamic QR code
export async function createDynamicQrCode(input: CreateDynamicQrCodeInput): Promise<{ success: boolean; error: string | null; qrCode: QRCode | null }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated.", qrCode: null };
  }

  const shortCode = generateShortCode(); // Generate a unique short code

  try {
    const [newQrCode] = await db
      .insert(qrCodes)
      .values({
        userId: session.user.id,
        data: shortCode, // Store the short code in the data field
        type: QrCodeType.URL, // Dynamic QR codes will always be URLs (for redirection)
        title: input.title,
        foregroundColor: input.foregroundColor,
        backgroundColor: input.backgroundColor,
        isDynamic: true, // Mark as dynamic
        shortCode: shortCode,
        targetUrl: input.targetUrl,
        scanCount: 0,
      })
      .returning();

    if (!newQrCode) {
      return { success: false, error: "Failed to create dynamic QR code.", qrCode: null };
    }

    const resultQrCode: QRCode = {
      ...newQrCode,
      createdAt: new Date(newQrCode.createdAt),
    } as QRCode;

    return { success: true, qrCode: resultQrCode, error: null };
  } catch (error: unknown) {
    console.error("Database error creating dynamic QR code:", error);
    let errorMessage = "An unknown database error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage, qrCode: null };
  }
}

// Server Action to fetch all QR codes for the authenticated user
export async function getUserQrCodes(): Promise<QRCode[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const codes = await db.query.qrCodes.findMany({
      where: eq(qrCodes.userId, session.user.id),
      orderBy: (table, { desc: orderByDesc }) => [orderByDesc(table.createdAt)],
    });

    return codes.map(qr => ({
      ...qr,
      createdAt: new Date(qr.createdAt),
      // If 'updatedAt' is not in your schema, remove this line or add it to schema
      // updatedAt: new Date(qr.updatedAt),
    })) as QRCode[]; // Ensure the mapping correctly casts to QRCode including new color fields
  } catch (error) {
    console.error("Error fetching user QR codes:", error);
    return [];
  }
}

// Server Action to delete a QR code by ID
export async function deleteQrCode(id: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated." };
  }

  try {
    const result = await db
      .delete(qrCodes)
      .where(eq(qrCodes.id, id))
      .returning({ id: qrCodes.id }); // Returning just the ID is usually enough to confirm deletion

    if (result.length === 0 || result[0]?.id !== id) { // Double check if the deleted id matches
      return { success: false, message: "QR Code not found or you don't have permission to delete it." };
    }

    return { success: true, message: "QR Code deleted successfully!" };
  } catch (error: unknown) {
    console.error("Database error deleting QR code:", error);
    let errorMessage = "An unknown database error occurred during deletion.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}

// Server Action to update an existing QR code
export async function updateQrCode(updatedQrCode: QRCode): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated." };
  }

  if (!updatedQrCode.id) {
    return { success: false, message: "QR code ID is missing for update." };
  }

  try {
    const result = await db
      .update(qrCodes)
      .set({
        title: updatedQrCode.title,
        data: updatedQrCode.data,
        type: updatedQrCode.type,
        foregroundColor: updatedQrCode.foregroundColor,
        backgroundColor: updatedQrCode.backgroundColor,
        isDynamic: updatedQrCode.isDynamic, // Ensure this is passed
        shortCode: updatedQrCode.shortCode, // Ensure this is passed
        targetUrl: updatedQrCode.targetUrl, // Ensure this is passed
        scanCount: updatedQrCode.scanCount, // Ensure this is passed
        // createdAt should not be updated here
        // If you have an 'updatedAt' field in your schema, you would set it here:
        // updatedAt: new Date(),
      })
      .where(eq(qrCodes.id, updatedQrCode.id))
      .returning({ id: qrCodes.id }); // Return the ID to confirm the update

    if (result.length === 0) {
      return { success: false, message: "QR code not found or you don't have permission to update it." };
    }

    return { success: true, message: "QR code updated successfully!" };
  } catch (error: unknown) {
    console.error("Database error updating QR code:", error);
    let errorMessage = "An unknown database error occurred during update.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}

// --- New Server Action for Multi-Page Sets ---
export async function getUserMultiPageSets(): Promise<MultiPageSet[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const sets = await db.query.multiPageSets.findMany({
      where: eq(multiPageSets.userId, session.user.id),
      orderBy: [desc(multiPageSets.createdAt)],
    });
    
    // Map the returned data to match the MultiPageSet type (handling Dates)
    return sets.map(set => ({
      ...set,
      createdAt: new Date(set.createdAt),
      updatedAt: new Date(set.updatedAt),
    })) as MultiPageSet[];
  } catch (error) {
    console.error("Error fetching multi-page sets:", error);
    return [];
  }
}