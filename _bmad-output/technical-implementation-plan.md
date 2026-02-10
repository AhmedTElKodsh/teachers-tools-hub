# Technical Implementation Plan
## Teacher Portal with Resource Sharing

**Project**: Teachers Tools Hub - Enhanced Portal
**Document Version**: 1.0
**Date**: 2026-02-02
**Author**: Sally (UX Designer) + Technical Architecture

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Supabase Setup Guide](#supabase-setup-guide)
4. [Database Schema](#database-schema)
5. [Authentication Implementation](#authentication-implementation)
6. [File Storage Implementation](#file-storage-implementation)
7. [API Design](#api-design)
8. [Component Architecture](#component-architecture)
9. [Privacy & Security](#privacy-and-security)
10. [Design System Integration](#design-system-integration)
11. [Phase 1 MVP Implementation Checklist](#phase-1-mvp-implementation-checklist)
12. [Testing Strategy](#testing-strategy)
13. [Deployment Guide](#deployment-guide)

---

## Executive Summary

This document provides a complete technical roadmap for transforming the Teachers Tools Hub from a simple AI tools directory into a full-featured teacher community platform with authentication, resource sharing, and user profiles.

### Key Features to Implement
- ✅ Teacher authentication (email/password)
- ✅ Resource upload and sharing (PDF, DOC, PPT, ZIP)
- ✅ Public/Private resource visibility controls
- ✅ Tool favorites system
- ✅ Hybrid tagging system (predefined + custom)
- ✅ Search and filter functionality
- ✅ Teacher profiles and reputation
- ✅ Download tracking and ratings

### Timeline Estimate
- **Phase 1 (MVP)**: Core authentication + resource upload/download
- **Phase 2**: Social features, ratings, advanced search
- **Phase 3**: Community features, analytics, notifications

---

## Technology Stack

### Frontend (Existing)
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Type Safety**: TypeScript
- **State Management**: React Context API
- **Forms**: React Hook Form (recommended)
- **Icons**: Heroicons / Lucide React

### Backend (New - Supabase)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **API**: Supabase REST API + Row Level Security
- **Real-time**: Supabase Realtime (future)

### Why Supabase?
1. **Built-in Authentication** - Email/password, OAuth ready
2. **PostgreSQL Database** - Robust, scalable, with full SQL support
3. **File Storage** - S3-compatible with built-in CDN
4. **Row Level Security** - Database-level privacy controls
5. **Generous Free Tier** - Perfect for MVP and growth
6. **Auto-generated REST API** - No backend code needed
7. **TypeScript Support** - Type-safe database queries

---

## Supabase Setup Guide

### Step 1: Create Supabase Account

```bash
# 1. Go to https://supabase.com
# 2. Click "Start your project"
# 3. Sign up with GitHub (recommended) or email
```

### Step 2: Create New Project

```bash
# In Supabase Dashboard:
# 1. Click "New Project"
# 2. Choose organization (create if first time)
# 3. Fill in project details:
#    - Name: "teachers-tools-hub"
#    - Database Password: (generate strong password - SAVE THIS!)
#    - Region: Choose closest to your users
# 4. Click "Create new project" (takes ~2 minutes)
```

### Step 3: Get API Credentials

```bash
# In your Supabase project:
# 1. Go to Settings > API
# 2. Copy these values:

# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Project API Key (anon/public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Service Role Key (keep SECRET - server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Step 4: Install Supabase Client

```bash
# Install Supabase JavaScript client
npm install @supabase/supabase-js

# Install Supabase Auth helpers for Next.js
npm install @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
```

### Step 5: Configure Environment Variables

Create `.env.local` file in project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

**Important**: Add `.env.local` to `.gitignore`!

### Step 6: Create Supabase Client Utilities

Create `web/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Client-side Supabase client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client (for API routes)
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

---

## Database Schema

### Complete SQL Schema

Run this SQL in Supabase SQL Editor (Settings > SQL Editor):

```sql
-- =============================================
-- TEACHERS TOOLS HUB DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- 1. PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  grade_level TEXT, -- e.g., "Elementary", "Middle School", "High School"
  primary_subject TEXT, -- e.g., "Math", "Science", "English"
  school_name TEXT,
  location TEXT, -- City, State/Country
  website_url TEXT,
  reputation_score INTEGER DEFAULT 0,
  total_uploads INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RESOURCES TABLE (uploaded files)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Metadata
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- "lesson_plan", "worksheet", "activity", "assessment", "presentation"

  -- File info
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- bytes
  file_type TEXT NOT NULL, -- "pdf", "doc", "docx", "ppt", "pptx", "zip"
  preview_image_url TEXT, -- thumbnail/preview

  -- Visibility & Status
  is_public BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published', -- "published", "draft", "archived"

  -- Engagement metrics
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TAGS TABLE (predefined + custom tags)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- "subject", "grade_level", "resource_type", "skill"
  is_predefined BOOLEAN DEFAULT FALSE, -- true for system tags, false for user-created
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RESOURCE_TAGS TABLE (many-to-many relationship)
CREATE TABLE resource_tags (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

-- 5. FAVORITES TABLE (saved resources)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- 6. TOOL_FAVORITES TABLE (saved AI tools from tools.json)
CREATE TABLE tool_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL, -- matches "id" from tools.json
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- 7. RATINGS TABLE (resource reviews)
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified_download BOOLEAN DEFAULT FALSE, -- only users who downloaded can rate
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- 8. DOWNLOADS TABLE (track who downloaded what)
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- null if user deleted
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. COMMENTS TABLE (Phase 2 - optional for MVP)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- for replies
  comment_text TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Resources indexes
CREATE INDEX idx_resources_user_id ON resources(user_id);
CREATE INDEX idx_resources_is_public ON resources(is_public);
CREATE INDEX idx_resources_resource_type ON resources(resource_type);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);
CREATE INDEX idx_resources_rating_average ON resources(rating_average DESC);
CREATE INDEX idx_resources_download_count ON resources(download_count DESC);

-- Tags indexes
CREATE INDEX idx_tags_category ON tags(category);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_resource_tags_resource_id ON resource_tags(resource_id);
CREATE INDEX idx_resource_tags_tag_id ON resource_tags(tag_id);

-- Favorites indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_resource_id ON favorites(resource_id);
CREATE INDEX idx_tool_favorites_user_id ON tool_favorites(user_id);

-- Ratings indexes
CREATE INDEX idx_ratings_resource_id ON ratings(resource_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);

-- Downloads indexes
CREATE INDEX idx_downloads_resource_id ON downloads(resource_id);
CREATE INDEX idx_downloads_user_id ON downloads(user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at on resources
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at on ratings
CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Teacher')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function: Update resource rating average
CREATE OR REPLACE FUNCTION update_resource_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE resources
  SET
    rating_average = (
      SELECT COALESCE(AVG(rating), 0)
      FROM ratings
      WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id)
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM ratings
      WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id)
    )
  WHERE id = COALESCE(NEW.resource_id, OLD.resource_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update rating average on insert/update/delete
CREATE TRIGGER update_resource_rating_on_change
  AFTER INSERT OR UPDATE OR DELETE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_resource_rating();

-- Function: Increment tag usage count
CREATE OR REPLACE FUNCTION increment_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tags
  SET usage_count = usage_count + 1
  WHERE id = NEW.tag_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Increment tag usage when added to resource
CREATE TRIGGER increment_tag_usage_on_insert
  AFTER INSERT ON resource_tags
  FOR EACH ROW
  EXECUTE FUNCTION increment_tag_usage();

-- Function: Increment download count
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE resources
  SET download_count = download_count + 1
  WHERE id = NEW.resource_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Increment download count on new download
CREATE TRIGGER increment_download_count_on_insert
  AFTER INSERT ON downloads
  FOR EACH ROW
  EXECUTE FUNCTION increment_download_count();

-- Function: Update user reputation score
CREATE OR REPLACE FUNCTION update_user_reputation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET reputation_score = (
    SELECT COALESCE(
      SUM(r.download_count) * 1 +  -- 1 point per download
      SUM(r.rating_average * r.rating_count) * 2 +  -- 2 points per star
      COUNT(DISTINCT f.user_id) * 5,  -- 5 points per unique favoriter
      0
    )
    FROM resources r
    LEFT JOIN favorites f ON f.resource_id = r.id
    WHERE r.user_id = COALESCE(NEW.user_id, OLD.user_id)
  ),
  total_uploads = (
    SELECT COUNT(*)
    FROM resources
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND status = 'published'
  )
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update reputation on resource changes
CREATE TRIGGER update_user_reputation_on_resource_change
  AFTER INSERT OR UPDATE OR DELETE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_user_reputation();

-- =============================================
-- SEED DATA: PREDEFINED TAGS
-- =============================================

INSERT INTO tags (name, category, is_predefined) VALUES
-- Subjects
('Math', 'subject', true),
('Science', 'subject', true),
('English/Language Arts', 'subject', true),
('Social Studies', 'subject', true),
('History', 'subject', true),
('Geography', 'subject', true),
('Art', 'subject', true),
('Music', 'subject', true),
('Physical Education', 'subject', true),
('Foreign Language', 'subject', true),
('Computer Science', 'subject', true),
('Special Education', 'subject', true),

-- Grade Levels
('Pre-K', 'grade_level', true),
('Kindergarten', 'grade_level', true),
('1st Grade', 'grade_level', true),
('2nd Grade', 'grade_level', true),
('3rd Grade', 'grade_level', true),
('4th Grade', 'grade_level', true),
('5th Grade', 'grade_level', true),
('6th Grade', 'grade_level', true),
('7th Grade', 'grade_level', true),
('8th Grade', 'grade_level', true),
('9th Grade', 'grade_level', true),
('10th Grade', 'grade_level', true),
('11th Grade', 'grade_level', true),
('12th Grade', 'grade_level', true),
('Higher Education', 'grade_level', true),

-- Resource Types
('Lesson Plan', 'resource_type', true),
('Worksheet', 'resource_type', true),
('Activity Guide', 'resource_type', true),
('Assessment', 'resource_type', true),
('Presentation', 'resource_type', true),
('Quiz', 'resource_type', true),
('Project Guide', 'resource_type', true),
('Rubric', 'resource_type', true),
('Handout', 'resource_type', true),

-- Skills
('Critical Thinking', 'skill', true),
('Problem Solving', 'skill', true),
('Collaboration', 'skill', true),
('Communication', 'skill', true),
('Creativity', 'skill', true),
('Reading Comprehension', 'skill', true),
('Writing', 'skill', true),
('Research', 'skill', true),
('Analysis', 'skill', true),
('STEM', 'skill', true);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RESOURCES POLICIES
-- Public resources viewable by everyone (authenticated or not)
CREATE POLICY "Public resources viewable by everyone"
  ON resources FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- Authenticated users can create resources
CREATE POLICY "Authenticated users can create resources"
  ON resources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own resources
CREATE POLICY "Users can update own resources"
  ON resources FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own resources
CREATE POLICY "Users can delete own resources"
  ON resources FOR DELETE
  USING (auth.uid() = user_id);

-- TAGS POLICIES
-- Everyone can view tags
CREATE POLICY "Tags viewable by everyone"
  ON tags FOR SELECT
  USING (true);

-- Authenticated users can create custom tags
CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND is_predefined = false);

-- RESOURCE_TAGS POLICIES
-- Everyone can view resource tags
CREATE POLICY "Resource tags viewable by everyone"
  ON resource_tags FOR SELECT
  USING (true);

-- Resource owners can manage their resource tags
CREATE POLICY "Resource owners can manage tags"
  ON resource_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM resources
      WHERE resources.id = resource_tags.resource_id
      AND resources.user_id = auth.uid()
    )
  );

-- FAVORITES POLICIES
-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- TOOL_FAVORITES POLICIES
-- Users can view their own tool favorites
CREATE POLICY "Users can view own tool favorites"
  ON tool_favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own tool favorites
CREATE POLICY "Users can manage own tool favorites"
  ON tool_favorites FOR ALL
  USING (auth.uid() = user_id);

-- RATINGS POLICIES
-- Everyone can view ratings
CREATE POLICY "Ratings viewable by everyone"
  ON ratings FOR SELECT
  USING (true);

-- Users can create ratings (only if they downloaded)
CREATE POLICY "Users can rate downloaded resources"
  ON ratings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM downloads
      WHERE downloads.resource_id = ratings.resource_id
      AND downloads.user_id = auth.uid()
    )
  );

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);

-- DOWNLOADS POLICIES
-- Users can view their own downloads
CREATE POLICY "Users can view own downloads"
  ON downloads FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can record downloads
CREATE POLICY "Authenticated users can record downloads"
  ON downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- COMMENTS POLICIES (Phase 2)
-- Everyone can view comments
CREATE POLICY "Comments viewable by everyone"
  ON comments FOR SELECT
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);
```

### TypeScript Types Generation

Generate TypeScript types from your database:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-ref

# Generate types
npx supabase gen types typescript --project-id your-project-ref > web/types/supabase.ts
```

---

## Authentication Implementation

### Step 1: Create Auth Context

Create `web/contexts/AuthContext.tsx`:

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  grade_level: string | null;
  primary_subject: string | null;
  reputation_score: number;
  total_uploads: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    // Reload profile
    await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Step 2: Add AuthProvider to Layout

Update `web/app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 3: Create Auth Modal Components

Create `web/components/AuthModal.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialView = 'signin' }: AuthModalProps) {
  const [view, setView] = useState<'signin' | 'signup'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {view === 'signin' ? 'Welcome Back!' : 'Join Our Community'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400" style={{ fontFamily: 'var(--font-sans)' }}>
            {view === 'signin' ? 'Sign in to access your resources' : 'Create an account to start sharing'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] focus:border-[#c96847] text-slate-900 dark:text-white transition-all hover:-translate-y-0.5"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] focus:border-[#c96847] text-slate-900 dark:text-white transition-all hover:-translate-y-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] focus:border-[#c96847] text-slate-900 dark:text-white transition-all hover:-translate-y-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient-primary py-3 px-6 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {loading ? 'Processing...' : view === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle View */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setView(view === 'signin' ? 'signup' : 'signin');
              setError('');
            }}
            className="text-[#c96847] dark:text-[#e08968] hover:underline text-sm font-medium"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {view === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Protected Route Hook

Create `web/hooks/useRequireAuth.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useRequireAuth(onUnauthenticated?: () => void) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        setShowAuthModal(true);
      }
    }
  }, [user, loading, onUnauthenticated]);

  return { user, loading, showAuthModal, setShowAuthModal };
}
```

---

## File Storage Implementation

### Step 1: Create Storage Bucket

In Supabase Dashboard:

1. Go to **Storage** section
2. Click **New bucket**
3. Configure:
   - Name: `resources`
   - Public bucket: **Yes** (for easier access)
   - File size limit: `10485760` (10MB)
   - Allowed MIME types:
     - `application/pdf`
     - `application/msword`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `application/vnd.ms-powerpoint`
     - `application/vnd.openxmlformats-officedocument.presentationml.presentation`
     - `application/zip`

### Step 2: Create Upload Utility

Create `web/lib/upload.ts`:

```typescript
import { supabase } from './supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
];

export async function uploadResource(file: File, userId: string) {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('File type not allowed. Please upload PDF, DOC, DOCX, PPT, PPTX, or ZIP files.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('resources')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('resources')
    .getPublicUrl(fileName);

  return {
    filePath: data.path,
    publicUrl,
    fileName: file.name,
    fileSize: file.size,
    fileType: fileExt || 'unknown',
  };
}

export async function deleteResource(filePath: string) {
  const { error } = await supabase.storage
    .from('resources')
    .remove([filePath]);

  if (error) throw error;
}

export function getFileIcon(fileType: string): string {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'ppt':
    case 'pptx':
      return '📊';
    case 'zip':
      return '📦';
    default:
      return '📎';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
```

### Step 3: Create Upload Form Component

Create `web/components/UploadResourceForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { uploadResource } from '@/lib/upload';

export default function UploadResourceForm() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState('lesson_plan');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill title if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedFile) return;

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      // Upload file
      const fileData = await uploadResource(selectedFile, user.id);

      // Create resource record
      const { data: resource, error: dbError } = await supabase
        .from('resources')
        .insert({
          user_id: user.id,
          title,
          description,
          resource_type: resourceType,
          file_url: fileData.publicUrl,
          file_name: fileData.fileName,
          file_size: fileData.fileSize,
          file_type: fileData.fileType,
          is_public: isPublic,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Add tags if selected
      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map(tagId => ({
          resource_id: resource.id,
          tag_id: tagId,
        }));

        const { error: tagError } = await supabase
          .from('resource_tags')
          .insert(tagInserts);

        if (tagError) throw tagError;
      }

      setSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setResourceType('lesson_plan');
      setIsPublic(true);
      setSelectedFile(null);
      setSelectedTags([]);

      // Clear file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload resource');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload */}
      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Choose File *
        </label>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
          required
          className="w-full"
        />
        {selectedFile && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Resource Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] text-slate-900 dark:text-white"
          placeholder="e.g., Multiplication Worksheet for 3rd Grade"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] text-slate-900 dark:text-white"
          placeholder="Describe your resource..."
        />
      </div>

      {/* Resource Type */}
      <div>
        <label htmlFor="resource-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Resource Type *
        </label>
        <select
          id="resource-type"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] text-slate-900 dark:text-white"
        >
          <option value="lesson_plan">Lesson Plan</option>
          <option value="worksheet">Worksheet</option>
          <option value="activity">Activity Guide</option>
          <option value="assessment">Assessment</option>
          <option value="presentation">Presentation</option>
        </select>
      </div>

      {/* Visibility */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-5 h-5 text-[#c96847] bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-[#c96847]"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Make this resource public (other teachers can view and download)
          </span>
        </label>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
          Resource uploaded successfully!
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading || !selectedFile}
        className="w-full btn-gradient-primary py-3 px-6 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Resource'}
      </button>
    </form>
  );
}
```

---

## API Design

### REST Endpoints (via Supabase)

All database operations use Supabase client - no custom API routes needed for basic CRUD:

```typescript
// Example: Fetch public resources
const { data, error } = await supabase
  .from('resources')
  .select(`
    *,
    profiles:user_id (full_name, avatar_url),
    resource_tags (
      tags (id, name, category)
    )
  `)
  .eq('is_public', true)
  .order('created_at', { ascending: false });

// Example: Add to favorites
const { error } = await supabase
  .from('favorites')
  .insert({
    user_id: userId,
    resource_id: resourceId,
  });

// Example: Rate a resource
const { error } = await supabase
  .from('ratings')
  .upsert({
    user_id: userId,
    resource_id: resourceId,
    rating: 5,
    review_text: 'Great resource!',
  });

// Example: Track download
const { error } = await supabase
  .from('downloads')
  .insert({
    user_id: userId,
    resource_id: resourceId,
  });
```

### Custom API Routes (Optional)

For complex operations, create Next.js API routes in `web/app/api/`:

**Example: `web/app/api/resources/trending/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('*, profiles:user_id(full_name, avatar_url)')
      .eq('is_public', true)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('download_count', { ascending: false })
      .order('rating_average', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Component Architecture

### New Components to Create

```
web/
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx           ✅ Created above
│   │   ├── SignInForm.tsx          (part of AuthModal)
│   │   └── SignUpForm.tsx          (part of AuthModal)
│   ├── resources/
│   │   ├── ResourceCard.tsx        📦 Resource display card
│   │   ├── ResourceGrid.tsx        📦 Grid of resources
│   │   ├── ResourceDetail.tsx      📦 Full resource view
│   │   ├── UploadResourceForm.tsx  ✅ Created above
│   │   ├── ResourceFilters.tsx     📦 Filter sidebar for resources
│   │   └── ResourceSearch.tsx      📦 Search component
│   ├── profile/
│   │   ├── ProfileCard.tsx         📦 User profile display
│   │   ├── ProfileEdit.tsx         📦 Edit profile form
│   │   └── UserResources.tsx       📦 User's uploaded resources
│   ├── favorites/
│   │   ├── FavoriteButton.tsx      📦 Toggle favorite
│   │   ├── FavoritesList.tsx       📦 List user favorites
│   │   └── ToolFavoriteButton.tsx  📦 Favorite AI tools
│   ├── ratings/
│   │   ├── RatingStars.tsx         📦 Star rating display
│   │   ├── RateResourceForm.tsx    📦 Submit rating
│   │   └── ReviewsList.tsx         📦 Display reviews
│   └── tags/
│       ├── TagSelector.tsx         📦 Multi-select tags
│       ├── TagBadge.tsx            📦 Display tag
│       └── TagCloud.tsx            📦 Popular tags
```

### Example: ResourceCard Component

Create `web/components/resources/ResourceCard.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatFileSize, getFileIcon } from '@/lib/upload';
import FavoriteButton from '../favorites/FavoriteButton';
import RatingStars from '../ratings/RatingStars';

interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  download_count: number;
  rating_average: number;
  rating_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
  resource_tags?: {
    tags: {
      id: string;
      name: string;
      category: string;
    };
  }[];
}

interface ResourceCardProps {
  resource: Resource;
  onDownload?: (resourceId: string) => void;
}

export default function ResourceCard({ resource, onDownload }: ResourceCardProps) {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!user) {
      alert('Please sign in to download resources');
      return;
    }

    setDownloading(true);

    try {
      // Record download
      await supabase.from('downloads').insert({
        user_id: user.id,
        resource_id: resource.id,
      });

      // Open file in new tab
      window.open(resource.file_url, '_blank');

      onDownload?.(resource.id);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="tool-card group relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-l-6 border-l-[#c96847] dark:border-l-[#e08968]">
      {/* File Type Icon */}
      <div className="absolute top-4 right-4 text-3xl">
        {getFileIcon(resource.file_type)}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 pr-12" style={{ fontFamily: 'var(--font-heading)' }}>
        {resource.title}
      </h3>

      {/* Description */}
      {resource.description && (
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2" style={{ fontFamily: 'var(--font-sans)' }}>
          {resource.description}
        </p>
      )}

      {/* Tags */}
      {resource.resource_tags && resource.resource_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.resource_tags.slice(0, 3).map(({ tags }) => (
            <span
              key={tags.id}
              className="category-badge px-2 py-1 text-xs rounded-full"
            >
              {tags.name}
            </span>
          ))}
          {resource.resource_tags.length > 3 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              +{resource.resource_tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <RatingStars rating={resource.rating_average} size="sm" />
          <span>({resource.rating_count})</span>
        </div>
        <div>
          📥 {resource.download_count} downloads
        </div>
        <div>
          {formatFileSize(resource.file_size)}
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="w-8 h-8 rounded-full bg-[#7a9d7e] dark:bg-[#9bb89e] flex items-center justify-center text-white font-semibold">
          {resource.profiles.full_name.charAt(0)}
        </div>
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {resource.profiles.full_name}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 btn-gradient-primary py-2 px-4 rounded-lg font-semibold text-white text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {downloading ? 'Downloading...' : 'Download'}
        </button>
        <FavoriteButton resourceId={resource.id} />
      </div>
    </div>
  );
}
```

---

## Privacy and Security

### Row Level Security (RLS) Summary

✅ **Already implemented in SQL schema above**

Key security rules:
1. **Public resources** - Anyone can view (authenticated or not)
2. **Private resources** - Only owner can view
3. **User profiles** - Everyone can view, only owner can edit
4. **Favorites** - Users can only see/manage their own
5. **Ratings** - Users can only rate resources they've downloaded
6. **Uploads** - Only authenticated users can upload
7. **Deletions** - Users can only delete their own content

### Additional Security Best Practices

1. **File validation** - Check file types and sizes before upload
2. **Sanitize input** - Clean user-submitted text (title, description)
3. **Rate limiting** - Prevent abuse (use Supabase edge functions if needed)
4. **Email verification** - Optional but recommended for Phase 2
5. **HTTPS only** - Enforce secure connections (Vercel does this automatically)

---

## Design System Integration

### Using Existing "Inspired Classroom" Theme

All new components should use the existing design tokens from `globals.css`:

```css
/* Color Variables */
--terracotta: #c96847;
--sage: #7a9d7e;
--navy: #2c4251;
--pencil-yellow: #ffd966;
--marker-blue: #6ba3d4;
--marker-pink: #e8879e;
--grade-a: #7dc383;

/* Typography */
--font-heading: 'Fraunces', serif;
--font-sans: 'DM Sans', sans-serif;
```

### Reusable Class Names

- `.tool-card` - Card with hover effects
- `.btn-gradient-primary` - Primary button with gradient
- `.category-badge` - Tag/badge styling
- `.pencil-underline` - Animated underline effect
- `.sticky-note` - Post-it note style
- `.grade-badge` - Success badge

### Example Component Styling

```typescript
<div className="tool-card group relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-l-6 border-l-[#c96847]">
  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
    Card Title
  </h3>
  <button className="btn-gradient-primary py-2 px-4 rounded-lg font-semibold text-white">
    Click Me
  </button>
</div>
```

---

## Phase 1 MVP Implementation Checklist

### Week 1: Foundation Setup
- [x] Set up Supabase project
- [x] Run database schema SQL
- [x] Configure environment variables
- [x] Install Supabase client libraries
- [x] Create Supabase utility files (`web/lib/supabase.ts`)
- [x] Set up storage bucket for resources

### Week 2: Authentication
- [x] Create `AuthContext` with sign-up/sign-in/sign-out
- [x] Build `AuthModal` component
- [x] Add auth state management
- [x] Implement protected route logic
- [x] Test email/password authentication
- [x] Handle auth errors gracefully

### Week 3: Resource Upload
- [x] Create `UploadResourceForm` component
- [x] Implement file upload utility (`web/lib/upload.ts`)
- [x] Add file validation (size, type)
- [x] Create resource metadata form (title, description, tags)
- [x] Test file upload to Supabase Storage
- [x] Link uploaded files to database records

### Week 4: Resource Display
- [x] Create `ResourceCard` component
- [x] Build `ResourceGrid` component
- [x] Implement resource fetching from database
- [x] Add loading states and error handling
- [x] Create resource detail page
- [x] Test public/private visibility

### Week 5: Core Features
- [x] Implement favorites system
  - [x] `FavoriteButton` component (Integrated in ResourceCard)
  - [x] Database operations for favorites
  - [x] Favorites page/list (In Dashboard)
- [x] Add download tracking
  - [x] Record downloads in database
  - [x] Update download count
  - [x] Require authentication for downloads

### Week 6: Tool Favorites
- [ ] Create `ToolFavoriteButton` for AI tools
- [ ] Add tool favorites to database
- [ ] Display user's favorite tools
- [ ] Integrate with existing tools.json
- [ ] Create "My Favorites" page showing both resources and tools

### Week 7: Search & Filters
- [x] Build search functionality for resources
- [x] Create filter sidebar
  - [x] Filter by resource type
  - [x] Filter by tags
  - [x] Filter by subject/grade level
- [x] Implement sorting (newest, most popular, highest rated)
- [ ] Add pagination or infinite scroll

### Week 8: User Profile & Dashboard
- [x] Create teacher profile page
  - [x] Display profile information
  - [x] Show uploaded resources
  - [x] Show reputation score
- [x] Build dashboard for logged-in users
  - [x] My Uploads section
  - [x] My Favorites section
  - [x] My Downloads section
- [ ] Add profile editing functionality

### Week 9: Ratings System (Phase 1.5)
- [ ] Create `RatingStars` component
- [ ] Build `RateResourceForm` component
- [ ] Implement rating submission
- [ ] Display average ratings on cards
- [ ] Show reviews list
- [ ] Restrict ratings to users who downloaded

### Week 10: Polish & Testing
- [ ] Mobile responsiveness testing
- [ ] Dark mode testing
- [ ] Performance optimization
  - [ ] Image optimization
  - [ ] Query optimization
  - [ ] Caching strategy
- [ ] Error handling improvements
- [ ] Loading state refinements
- [ ] Accessibility audit (keyboard navigation, screen readers)

### Week 11: Deployment
- [ ] Environment variables in Vercel
- [ ] Database migrations (if any)
- [ ] Test production build locally
- [ ] Deploy to Vercel
- [ ] Test all features in production
- [ ] Monitor Supabase usage

### Week 12: Launch & Iteration
- [ ] Soft launch to small group of teachers
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Monitor analytics and usage
- [ ] Plan Phase 2 features

---

## Review Notes
- Adversarial review completed (Step 5).
- Findings: 10 total.
- Resolution: Deferred optimization findings (Client-side filtering, Pagination) to Phase 2.
- Deferred "Tool Favorites" integration to maintain focus on Resource Sharing MVP.
- Code cleanup (unused comments) pending next commit.


---

## Testing Strategy

### Manual Testing Checklist

**Authentication**
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Sign out
- [ ] Try accessing protected pages without auth
- [ ] Test password requirements
- [ ] Test email validation

**File Upload**
- [ ] Upload PDF file
- [ ] Upload DOC/DOCX file
- [ ] Upload PPT/PPTX file
- [ ] Upload ZIP file
- [ ] Try uploading file > 10MB (should fail)
- [ ] Try uploading invalid file type (should fail)
- [ ] Verify file appears in Supabase Storage

**Resources**
- [ ] View public resources (logged out)
- [ ] View public resources (logged in)
- [ ] View only my private resources
- [ ] Download resource
- [ ] Verify download count increases
- [ ] Search for resources
- [ ] Filter by type
- [ ] Filter by tags
- [ ] Sort by different criteria

**Favorites**
- [ ] Add resource to favorites
- [ ] Remove resource from favorites
- [ ] View favorites list
- [ ] Add tool to favorites
- [ ] Remove tool from favorites

**Ratings**
- [ ] Rate a downloaded resource
- [ ] Try rating without downloading (should fail)
- [ ] Edit existing rating
- [ ] Delete rating
- [ ] Verify average rating updates

**Profile**
- [ ] View own profile
- [ ] View another user's profile
- [ ] Edit profile information
- [ ] Upload profile avatar
- [ ] Verify reputation score updates

### Automated Testing (Optional - Phase 2)

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Example test structure
web/
├── __tests__/
│   ├── components/
│   │   ├── AuthModal.test.tsx
│   │   ├── ResourceCard.test.tsx
│   │   └── UploadForm.test.tsx
│   ├── lib/
│   │   ├── upload.test.ts
│   │   └── supabase.test.ts
│   └── integration/
│       ├── auth-flow.test.tsx
│       └── upload-flow.test.tsx
```

---

## Deployment Guide

### Prerequisites
- [ ] Supabase project fully configured
- [ ] All environment variables documented
- [ ] Database schema applied
- [ ] Storage buckets created
- [ ] RLS policies enabled

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Push code to GitHub
   git add .
   git commit -m "feat: Add teacher portal with resource sharing"
   git push origin main
   ```

2. **Configure Vercel Project**
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Set root directory to `web`
   - Framework preset: Next.js

3. **Set Environment Variables**
   In Vercel dashboard, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_MAX_FILE_SIZE=10485760
   ```

4. **Deploy**
   ```bash
   # Vercel will automatically deploy on git push
   # Or manually trigger:
   npx vercel --prod
   ```

5. **Post-Deployment Verification**
   - [ ] Test sign-up flow
   - [ ] Test file upload
   - [ ] Test downloads
   - [ ] Check Supabase logs
   - [ ] Monitor error tracking

### Custom Domain (Optional)

1. Go to Vercel Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

---

## Monitoring & Maintenance

### Supabase Dashboard Monitoring

**Key Metrics to Watch:**
- **Database**: Monitor query performance, table sizes
- **Storage**: Track storage usage, file uploads
- **Auth**: Monitor sign-ups, active users
- **API**: Watch request counts, error rates

### Setting Up Alerts

1. **Database Alerts**
   - Set up alerts for high CPU usage
   - Monitor connection pool exhaustion

2. **Storage Alerts**
   - Alert when approaching storage limits
   - Monitor unusual file upload patterns

3. **Error Tracking**
   - Integrate Sentry or similar for error tracking
   - Monitor auth failures
   - Track upload errors

### Regular Maintenance Tasks

**Daily:**
- Check error logs in Supabase
- Monitor user sign-ups

**Weekly:**
- Review slow queries
- Check storage usage
- Analyze popular resources

**Monthly:**
- Review and optimize database indexes
- Clean up unused files (if any)
- Update dependencies
- Security audit

---

## Future Enhancements (Phase 2+)

### Phase 2: Social Features
- [ ] Comments on resources
- [ ] Teacher profiles with bio and portfolio
- [ ] Follow other teachers
- [ ] Activity feed
- [ ] Notifications system
- [ ] Resource collections/playlists

### Phase 3: Advanced Search & Discovery
- [ ] Full-text search (Postgres FTS)
- [ ] Semantic search with embeddings
- [ ] Personalized recommendations
- [ ] "Similar resources" suggestions
- [ ] Trending topics

### Phase 4: Community Features
- [ ] Teacher discussion forums
- [ ] Resource bundles/packs
- [ ] Collaborative resource editing
- [ ] Resource versioning
- [ ] Premium/paid resources marketplace

### Phase 5: Analytics & Insights
- [ ] Teacher analytics dashboard
- [ ] Resource performance metrics
- [ ] Usage heatmaps
- [ ] Export reports
- [ ] A/B testing framework

---

## Support & Resources

### Documentation Links
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

### Supabase Community
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)

### Troubleshooting

**Common Issues:**

1. **CORS Errors**
   - Check Supabase project URL
   - Verify anon key is correct
   - Ensure RLS policies are configured

2. **Upload Failures**
   - Check file size limits
   - Verify storage bucket permissions
   - Check MIME types allowed

3. **Auth Not Working**
   - Verify email confirmation settings
   - Check redirect URLs in Supabase Auth settings
   - Ensure auth callback URL is configured

4. **Database Queries Slow**
   - Add indexes to frequently queried columns
   - Use `select()` to fetch only needed columns
   - Consider caching with React Query

---

## Conclusion

This technical implementation plan provides everything needed to build the Teachers Tools Hub enhancement. The MVP focuses on core functionality:

✅ **Authentication** - Secure teacher sign-up/sign-in
✅ **Resource Sharing** - Upload, download, and manage files
✅ **Privacy Controls** - Public/private resource visibility
✅ **Favorites** - Save tools and resources
✅ **Ratings** - Community feedback system
✅ **Search & Filters** - Discover resources easily
✅ **Teacher Profiles** - Build reputation and showcase work

The modular architecture allows for iterative development, starting with the MVP and gradually adding Phase 2+ features based on user feedback.

**Next Steps:**
1. Set up Supabase project (Week 1)
2. Run database schema SQL
3. Begin authentication implementation (Week 2)
4. Follow the 12-week implementation checklist

---

**Document Prepared By**: Sally (UX Designer)
**For**: Ahmed - Teachers Tools Hub Project
**Version**: 1.0
**Date**: 2026-02-02

**Ready to build? Let's transform Teachers Tools Hub into an amazing community platform! 🎓✨**
