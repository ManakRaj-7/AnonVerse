# AnonVerse - Anonymous Literature Community
# [Live Demo](https://anon-verse-wl1l.vercel.app/)

A full-stack web application where users can anonymously share poetry and literary works using pen names. Built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Anonymous Authentication**: Sign up with email and create a pen name
- **Poetry Sharing**: Create and publish poems with titles and content
- **Social Features**: Like and comment on poems
- **User Profiles**: Manage your pen name and bio
- **Clean UI**: Minimal, distraction-free interface focused on content
- **Real-time Updates**: Instant feedback on interactions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Real-time)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Database Schema

The application uses the following tables:

- `profiles`: User profiles with pen names and bios
- `poems`: Poetry content with titles and authors
- `likes`: User likes on poems
- `comments`: User comments on poems
- `followers`: User follow relationships (ready for future features)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd anonverse
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy the SQL from `supabase-setup.sql` and run it in your Supabase SQL editor
4. Configure authentication:
   - Go to Authentication > Settings
   - Enable "Enable email confirmations" if desired
   - Set your site URL (will be your Vercel URL after deployment)

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/               # React components
│   ├── auth-form.tsx         # Login/signup form
│   ├── auth-provider.tsx     # Authentication context
│   ├── create-poem.tsx       # Poem creation form
│   ├── loading-spinner.tsx   # Loading spinner
│   ├── main-app.tsx          # Main application
│   ├── navigation.tsx        # Navigation bar
│   ├── poem-card.tsx         # Individual poem display
│   ├── poem-feed.tsx         # Poetry feed
│   ├── profile.tsx           # User profile
│   └── ui/                   # Reusable UI components
│       ├── alert.tsx         # Alert component
│       ├── button.tsx        # Button component
│       ├── card.tsx          # Card component
│       ├── input.tsx         # Input component
│       ├── label.tsx         # Label component
│       ├── tabs.tsx          # Tabs component
│       └── textarea.tsx      # Textarea component
├── lib/                      # Utility functions
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Helper functions
├── .gitignore                # Git ignore file
├── DEPLOYMENT.md             # Deployment instructions
├── env.example               # Example environment variables
├── next-env.d.ts             # Next.js type definitions
├── next.config.js            # Next.js config
├── package.json              # Project metadata and scripts
├── postcss.config.js         # PostCSS config
├── supabase-setup.sql        # Database setup script
├── tailwind.config.js        # Tailwind CSS config
├── test-env.js               # Test environment setup
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## Key Features Implementation

### Authentication
- Anonymous signup with pen names
- Email/password authentication
- Automatic profile creation on signup
- Session management with Supabase Auth

### Poetry Feed
- Real-time poem display
- Like/unlike functionality
- Comment system with nested display
- Author information with pen names
- Timestamp formatting

### User Experience
- Clean, minimal interface
- Responsive design
- Loading states and error handling
- Form validation
- Success feedback

## Future Enhancements

The application is designed to be easily extensible for:

- **Monetization**: Token tipping system
- **Advanced Social Features**: Follow/unfollow, user discovery
- **Content Moderation**: Report system, admin panel
- **Analytics**: View counts, engagement metrics
- **Rich Content**: Image uploads, formatting options
- **Notifications**: Real-time notifications for interactions

## Security Features

- Row Level Security (RLS) on all database tables
- User authentication required for write operations
- Input validation and sanitization
- Secure API endpoints
- Environment variable protection

## Performance Optimizations

- Database indexes for fast queries
- Optimistic UI updates
- Efficient data fetching
- Minimal bundle size with tree shaking
- Responsive images and lazy loading ready

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the GitHub repository.

---

**AnonVerse** - Where words find their voice, anonymously.
