# Deployment Guide - AnonVerse

This guide will walk you through deploying AnonVerse to Vercel and setting up Supabase.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)

## Step 1: Set up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `anonverse` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (2-3 minutes)

### 1.2 Get API Keys

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon** key (starts with `eyJ`)

### 1.3 Set up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy the entire contents of `supabase-setup.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the script
6. Verify the tables were created by going to **Table Editor**

### 1.4 Configure Authentication

1. Go to **Authentication** > **Settings**
2. Under **Site URL**, add your Vercel URL (you'll get this after deployment)
3. Under **Redirect URLs**, add:
   - `https://your-vercel-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)
4. Save changes

## Step 2: Prepare Your Code

### 2.1 Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/anonverse.git
git push -u origin main
```

### 2.2 Environment Variables

Create a `.env.local` file locally for development:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project

### 3.2 Configure Project

1. **Project Name**: `anonverse` (or your preferred name)
2. **Framework Preset**: Next.js (should be auto-detected)
3. **Root Directory**: `./` (leave as default)
4. **Build Command**: `npm run build` (should be auto-detected)
5. **Output Directory**: `.next` (should be auto-detected)
6. **Install Command**: `npm install` (should be auto-detected)

### 3.3 Add Environment Variables

1. In the project configuration, go to **Environment Variables**
2. Add the following variables:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environment**: Production, Preview, Development
3. Add the second variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key
   - **Environment**: Production, Preview, Development

### 3.4 Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. Your app will be available at `https://your-app-name.vercel.app`

## Step 4: Update Supabase Settings

### 4.1 Update Site URL

1. Go back to your Supabase dashboard
2. Go to **Authentication** > **Settings**
3. Update **Site URL** to your Vercel URL
4. Add your Vercel URL to **Redirect URLs** if not already there
5. Save changes

## Step 5: Test Your Deployment

### 5.1 Test Authentication

1. Visit your Vercel URL
2. Try to sign up with a new account
3. Verify you can log in and out
4. Check that your pen name is created

### 5.2 Test Core Features

1. Create a new poem
2. Like and comment on poems
3. Update your profile
4. Test on mobile devices

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain

1. In Vercel dashboard, go to **Settings** > **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Update Supabase redirect URLs to include your custom domain

## Troubleshooting

### Common Issues

**Build Fails**
- Check that all dependencies are in `package.json`
- Verify TypeScript types are correct
- Check Vercel build logs for specific errors

**Authentication Not Working**
- Verify Supabase URL and key are correct
- Check that redirect URLs are properly configured
- Ensure database tables were created successfully

**Database Errors**
- Run the SQL setup script again
- Check Row Level Security policies
- Verify user permissions

**Environment Variables**
- Make sure variables are added to all environments (Production, Preview, Development)
- Check that variable names match exactly
- Restart deployment after adding variables

### Getting Help

1. Check Vercel deployment logs
2. Check Supabase logs in the dashboard
3. Review browser console for client-side errors
4. Verify all environment variables are set correctly

## Post-Deployment

### 6.1 Monitor Performance

1. Set up Vercel Analytics (optional)
2. Monitor Supabase usage in dashboard
3. Check for any errors in logs

### 6.2 Security Considerations

1. Regularly update dependencies
2. Monitor Supabase security logs
3. Consider setting up monitoring alerts

### 6.3 Scaling

1. Upgrade Supabase plan if needed
2. Consider Vercel Pro for advanced features
3. Monitor database performance

## Maintenance

### Regular Tasks

1. **Weekly**: Check for dependency updates
2. **Monthly**: Review Supabase usage and costs
3. **Quarterly**: Security audit and performance review

### Updates

1. Pull latest changes from GitHub
2. Test locally first
3. Deploy to Vercel
4. Monitor for any issues

---

Your AnonVerse application is now live! 🎉

For support, check the main README.md file or open an issue in the GitHub repository.
