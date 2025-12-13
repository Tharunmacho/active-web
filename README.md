# ACTV Web Application

A comprehensive membership management system with multi-level administrative hierarchy and member portal.

## 🚀 Features

### Member Portal
- **Registration & Login** - Secure authentication with password management
- **Dashboard** - Personalized member dashboard with application tracking
- **ADF Form** - Application Data Form submission
- **Certificate Management** - View and download member certificates
- **Payment Processing** - Integrated payment system with history tracking
- **Profile Management** - Update personal information and account settings
- **Events & Notifications** - Stay updated with latest events and announcements

### Admin Portal (Multi-Level Hierarchy)
- **Block Admin** - Manage block-level applications and members
- **District Admin** - Oversee district-wide operations
- **State Admin** - State-level administration and oversight
- **Super Admin** - Full system access and admin credential generation

#### Admin Features
- Application approval workflow
- Member management
- Real-time dashboard with statistics
- Application status tracking
- Settings management
- Hierarchical access control

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **Form Handling**: React Hook Form 7.61.1 with Zod validation
- **State Management**: TanStack Query 5.83.0
- **Icons**: Lucide React & React Icons
- **Charts**: Recharts 2.15.4
- **Notifications**: Sonner

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd actv-webfinal

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

## 🏃 Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run build:dev    # Build with development mode

# Code Quality
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🗂️ Project Structure

```
actv-webfinal/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── layout/      # Layout components
│   ├── data/            # Static data (districts, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── pages/           # Route pages
│   │   ├── admin/       # Admin pages
│   │   └── member/      # Member pages
│   ├── utils/           # Utility functions
│   │   └── authService.ts  # Authentication service
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── scripts/             # Build/utility scripts
└── package.json         # Dependencies
```

## 🔐 Authentication Flow

### Member Authentication
1. Registration with email/phone verification
2. Login with credentials
3. Password reset functionality
4. Session management with localStorage

### Admin Authentication
- **Role-based login** with separate portals:
  - `/admin/block/login` - Block Admin
  - `/admin/district/login` - District Admin
  - `/admin/state/login` - State Admin
  - `/admin/super/login` - Super Admin

### Default Admin Credentials (Development Only)
```
Block Admin: block_admin_001 / block_pass_123
District Admin: district_admin_001 / district_pass_123
State Admin: state_admin_001 / state_pass_123
Super Admin: super_admin_001 / super_pass_123
```

⚠️ **Security Note**: In production, implement proper authentication backend with encrypted passwords and JWT tokens.

## 🌐 API Integration

The application connects to a backend API at `http://localhost:4000/api/` for:
- User authentication
- Application management
- Member data
- Payment processing

### Key Endpoints
- `POST /api/login` - Authentication
- `GET /api/users/:id/applications` - User applications
- `POST /api/applications` - Submit application
- And more...

## 📱 Responsive Design

- **Mobile-first** approach with dedicated mobile components
- **Sidebar navigation** for desktop with collapsible drawer
- **Mobile menu** with touch-friendly interface
- **Responsive tables** and cards for all screen sizes

## 🎨 UI Components

Built with **shadcn/ui** providing:
- Accordion, Alerts, Avatars, Badges
- Buttons, Cards, Checkboxes, Dialogs
- Dropdowns, Forms, Inputs, Modals
- Navigation, Pagination, Popovers
- Tables, Tabs, Tooltips, and more

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind CSS setup
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules
- `components.json` - shadcn/ui configuration

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Environment Variables
Create a `.env` file for environment-specific configuration:
```env
VITE_API_URL=https://your-api-url.com/api
VITE_APP_NAME=ACTV
```

## 📄 License

[Add your license here]

## 👥 Contributing

[Add contribution guidelines]

## 📞 Support

For support, email: [your-email@example.com]

## 🙏 Acknowledgments

- Built with React and Vite
- UI components by shadcn/ui
- Icons by Lucide and React Icons

