# Card Saver Features

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mohammedm22abca-acharyaacis-projects/v0-card-saver-features)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/mMCOXc9zzYJ)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Setup Instructions

### 1. Supabase Configuration

Before running the application, you need to set up Supabase:

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be fully set up

2. **Get Your Project Credentials**:
   - Go to your project settings
   - Navigate to the "API" section
   - Copy your project URL and anon key

3. **Configure Environment Variables**:
   - Copy `.env.local` to your project root
   - Replace the placeholder values with your actual Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

4. **Set Up Database Tables**:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the following SQL to create the required tables:

   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     email TEXT NOT NULL,
     display_name TEXT,
     avatar_url TEXT
   );

   -- Create cards table
   CREATE TABLE cards (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     card_name TEXT NOT NULL,
     bank_name TEXT,
     card_data JSONB NOT NULL
   );

   -- Create documents table
   CREATE TABLE documents (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     document_name TEXT NOT NULL,
     document_type TEXT NOT NULL,
     holder_name TEXT,
     issue_date DATE,
     expiry_date DATE,
     issuing_authority TEXT,
     has_pin BOOLEAN DEFAULT FALSE,
     document_data JSONB NOT NULL
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
   ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

   CREATE POLICY "Users can view own cards" ON cards FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own cards" ON cards FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own cards" ON cards FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own cards" ON cards FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

   -- Create function to handle new user profiles
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, email)
     VALUES (NEW.id, NEW.email);
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Create trigger for new user profiles
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

### 2. Running the Application

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### 3. Features

- **Secure Card Storage**: Store payment cards with encryption
- **Document Management**: Store important documents securely
- **PIN Protection**: Access control with PIN verification
- **Categories & Statistics**: Organize and analyze your data
- **Cloud Sync**: Data synchronized across devices
- **Dark/Light Mode**: Theme switching support

## Deployment

Your project is live at:

**[https://vercel.com/mohammedm22abca-acharyaacis-projects/v0-card-saver-features](https://vercel.com/mohammedm22abca-acharyaacis-projects/v0-card-saver-features)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/mMCOXc9zzYJ](https://v0.dev/chat/projects/mMCOXc9zzYJ)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Troubleshooting

### Environment Variables Not Found
If you see "supabaseUrl is required" error:
1. Make sure `.env.local` exists in your project root
2. Verify your Supabase URL and keys are correct
3. Restart your development server after adding environment variables

### Database Connection Issues
1. Check that your Supabase project is active
2. Verify the database tables are created
3. Ensure Row Level Security policies are properly set up