# UX Design & UI Plan: Teacher Portal & Resource Sharing
**Project:** Teachers Tools Hub
**Created:** 2026-02-02
**Designer:** Sally (UX Designer)
**For:** Ahmed

---

## 🎯 Executive Summary

Transform Teachers Tools Hub from a simple AI tools directory into a **thriving teacher community** where educators discover AI tools, share resources, and build professional reputation.

### Core User Needs
1. **Security**: Protected file sharing and access control
2. **Personalization**: Favorite/save preferred tools
3. **Contribution**: Upload and share teaching resources
4. **Discovery**: Find quality resources from peers
5. **Recognition**: Build reputation in the community

---

## 👥 User Personas

### Primary Persona: "Curious Sarah"
**Role:** 4th Grade Science Teacher
**Age:** 32
**Tech Savvy:** Medium
**Pain Points:**
- Spends hours searching for quality teaching materials
- Wants to share her best worksheets but no platform
- Overwhelmed by generic edu-tech sites
- Needs quick wins (fast downloads, easy sharing)

**Goals:**
- Find AI tools that actually save time
- Access peer-created resources that work
- Share her materials to help other teachers
- Build a professional portfolio

### Secondary Persona: "Veteran Tom"
**Role:** High School Math Teacher
**Age:** 48
**Tech Savvy:** Low-Medium
**Pain Points:**
- Skeptical of "tech solutions"
- Needs simple, clear interfaces
- Wants proof something works before committing
- Privacy-conscious about personal materials

**Goals:**
- Quick access to proven tools
- Safe storage for his lesson plans
- Easy discovery (no learning curve)
- Control over who sees his content

---

## 🗺️ Information Architecture

```
Teachers Tools Hub
│
├── 🏠 Home (Current - AI Tools Discovery)
│   ├── Hero Section
│   ├── Search/Filter AI Tools
│   ├── Tool Cards Grid
│   └── Quick Actions (Sign In, Join)
│
├── 🔐 Authentication
│   ├── Sign In Modal
│   ├── Sign Up Modal
│   └── Google OAuth (optional)
│
├── 📚 Resources Library (NEW)
│   ├── Browse All Resources
│   ├── Search & Filter
│   │   ├── By Keyword
│   │   ├── By Subject
│   │   ├── By Grade Level
│   │   ├── By Resource Type
│   │   └── By Skills
│   ├── Trending Resources
│   ├── Popular Resources
│   └── Resource Detail View
│
├── 👤 My Dashboard (NEW - Authenticated Only)
│   ├── My Favorite Tools
│   ├── My Uploaded Resources
│   ├── My Downloads History
│   ├── My Profile Stats
│   └── Upload New Resource
│
└── 👨‍🏫 Teacher Profile (NEW)
    ├── Teacher Bio
    ├── Uploaded Resources
    ├── Reputation Score
    └── Activity Stats
```

---

## 🎨 Page-by-Page Design

### 1. **Home Page Enhancement**

**Current State:** AI Tools directory with search
**New State:** Add authentication prompt + resource tease

#### Key Changes:
```
┌─────────────────────────────────────────┐
│  Header (Enhanced)                      │
│  - Add "Sign In" button (top-right)    │
│  - Add "Resources" nav link             │
│  - Keep theme/language toggles          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Hero Section                           │
│  "Discover AI Tools + Share Resources"  │
│  [Existing search bar]                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  AI Tools Grid (Existing)               │
│  - Add "heart" icon for favoriting      │
│  - Show "Sign in to favorite" tooltip   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  NEW: Resources Teaser Section          │
│  "Discover Teacher-Shared Resources"    │
│  [3 trending resources preview]         │
│  [Browse All Resources CTA]             │
└─────────────────────────────────────────┘
```

---

### 2. **Authentication Modals**

**Design Philosophy:** Quick, friction-free, trustworthy

#### Sign In Modal
```
┌────────────────────────────────────┐
│  Welcome Back! 👋                  │
│                                    │
│  Email: [________________]         │
│  Password: [________________]      │
│                                    │
│  [ Forgot Password? ]              │
│                                    │
│  [    Sign In    ]                 │
│                                    │
│  ─────── or ───────                │
│                                    │
│  [ 🔵 Sign in with Google ]        │
│  (if easy to implement)            │
│                                    │
│  New here? [Join the Community]    │
└────────────────────────────────────┘
```

#### Sign Up Modal
```
┌────────────────────────────────────┐
│  Join the Teacher Community! 🎓    │
│                                    │
│  Full Name: [________________]     │
│  Email: [________________]         │
│  Password: [________________]      │
│  Confirm: [________________]       │
│                                    │
│  I teach: [Grade Level ▼]         │
│  Primary Subject: [Subject ▼]     │
│                                    │
│  [ ] I agree to Terms & Privacy    │
│                                    │
│  [    Create Account    ]          │
│                                    │
│  ─────── or ───────                │
│                                    │
│  [ 🔵 Sign up with Google ]        │
│                                    │
│  Have an account? [Sign In]        │
└────────────────────────────────────┘
```

**Trigger Points:**
1. Click "Sign In" button (header)
2. Click "favorite" heart on tool card
3. Click "Download" on resource
4. Click "Upload Resource"

---

### 3. **Resources Library Page (NEW)**

**URL:** `/resources`
**Purpose:** Browse all teacher-shared resources

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Global)                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  PAGE TITLE                                              │
│  "Teacher Resources Library"                             │
│  "Discover lesson plans, worksheets, and activities      │
│   shared by educators like you"                          │
│                                                          │
│  [Search resources...] 🔍                                │
└─────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────┐
│  FILTERS         │  RESOURCES GRID                      │
│  (Sidebar)       │                                      │
│                  │  ┌─────────────────────────────────┐│
│  📊 Sort By:     │  │  Sort: Trending ▼   View: Grid  ││
│  • Trending      │  └─────────────────────────────────┘│
│  • Most Popular  │                                      │
│  • Newest        │  ┌───────┐ ┌───────┐ ┌───────┐    │
│  • Top Rated     │  │ Card  │ │ Card  │ │ Card  │    │
│                  │  │  📄   │ │  📄   │ │  📄   │    │
│  🏷️ Resource Type│  └───────┘ └───────┘ └───────┘    │
│  ☐ Lesson Plans  │                                      │
│  ☐ Worksheets    │  ┌───────┐ ┌───────┐ ┌───────┐    │
│  ☐ Activities    │  │ Card  │ │ Card  │ │ Card  │    │
│  ☐ Assessments   │  │  📄   │ │  📄   │ │  📄   │    │
│  ☐ Presentations │  └───────┘ └───────┘ └───────┘    │
│                  │                                      │
│  📚 Subject      │  [Load More]                         │
│  ☐ Math          │                                      │
│  ☐ Science       │                                      │
│  ☐ English       │                                      │
│  ☐ Social Studies│                                      │
│  ☐ Arts          │                                      │
│  + More...       │                                      │
│                  │                                      │
│  🎓 Grade Level  │                                      │
│  ☐ K-2           │                                      │
│  ☐ 3-5           │                                      │
│  ☐ 6-8           │                                      │
│  ☐ 9-12          │                                      │
│                  │                                      │
│  🎯 Skills       │                                      │
│  (Custom tags)   │                                      │
│                  │                                      │
│  [Clear All]     │                                      │
└──────────────────┴──────────────────────────────────────┘
```

#### Resource Card Design
```
┌───────────────────────────────────┐
│  📄 [Preview Image/Icon]          │
│                                   │
│  Fraction Worksheet Pack          │
│  By: Sarah Martinez ⭐ 4.8        │
│                                   │
│  Grade 4 | Math | Worksheets     │
│                                   │
│  "Complete set of fraction        │
│   practice worksheets..."         │
│                                   │
│  🔽 247 downloads  ❤️ 89 favs    │
│                                   │
│  [View Details] [Download] ❤️     │
└───────────────────────────────────┘
```

**Interaction:**
- **Not Signed In:** Clicking "Download" or "❤️" triggers Sign In modal
- **Signed In:** Direct download, instant favorite

---

### 4. **Resource Detail Page (NEW)**

**URL:** `/resources/[id]`

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Global)                                         │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  ← Back to Resources                         │
└──────────────────────────────────────────────┘

┌─────────────────┬────────────────────────────┐
│  PREVIEW        │  DETAILS                   │
│                 │                            │
│  [Large         │  Fraction Worksheet Pack   │
│   Preview       │                            │
│   Image]        │  By: Sarah Martinez 👤     │
│                 │  ⭐⭐⭐⭐⭐ 4.8 (34 ratings) │
│  [Gallery]      │                            │
│  [○][○][○]      │  📚 Math • 🎓 Grade 4      │
│                 │  📄 Worksheets              │
│                 │                            │
│                 │  Tags: #fractions #math    │
│                 │  #practice #grade4         │
│                 │                            │
│                 │  Description:              │
│                 │  Complete set of fraction  │
│                 │  practice worksheets with  │
│                 │  answer keys. Covers:      │
│                 │  - Basic concepts          │
│                 │  - Adding/subtracting      │
│                 │  - Visual models           │
│                 │                            │
│                 │  Downloads: 247            │
│                 │  Uploaded: Jan 15, 2026    │
│                 │                            │
│                 │  [Download Resource]       │
│                 │  [Add to Favorites ❤️]     │
│                 │                            │
└─────────────────┴────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Reviews & Ratings                           │
│                                              │
│  ⭐⭐⭐⭐⭐ "Excellent!" - Tom R.            │
│  ⭐⭐⭐⭐☆ "Very helpful" - Lisa K.          │
│  [Load More Reviews]                         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  More from Sarah Martinez                    │
│  [Card] [Card] [Card]                        │
└──────────────────────────────────────────────┘
```

---

### 5. **My Dashboard (NEW - Authenticated)**

**URL:** `/dashboard`
**Purpose:** Teacher's personal hub

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Global)                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Welcome back, Sarah! 👋                                 │
│                                                          │
│  Quick Stats:                                            │
│  📚 12 Resources  |  🔽 247 Downloads  |  ⭐ 4.8 Rating │
└─────────────────────────────────────────────────────────┘

┌───────────────────┬─────────────────────────────────────┐
│  SIDEBAR NAV      │  CONTENT AREA                       │
│                   │                                     │
│  🏠 Dashboard     │  [UPLOAD NEW RESOURCE] 📤          │
│  ⭐ My Favorites  │                                     │
│  📤 My Uploads    │  ┌─────────────────────────────┐  │
│  🔽 Downloads     │  │  My Recent Uploads          │  │
│  📊 My Stats      │  ├─────────────────────────────┤  │
│  ⚙️ Settings      │  │  [Resource Card]            │  │
│  🚪 Sign Out      │  │  [Resource Card]            │  │
│                   │  │  [Resource Card]            │  │
│                   │  └─────────────────────────────┘  │
│                   │                                     │
│                   │  ┌─────────────────────────────┐  │
│                   │  │  Favorite AI Tools          │  │
│                   │  ├─────────────────────────────┤  │
│                   │  │  [Tool Card] [Tool Card]    │  │
│                   │  └─────────────────────────────┘  │
└───────────────────┴─────────────────────────────────────┘
```

---

### 6. **Upload Resource Flow (NEW)**

**Triggered:** Click "Upload Resource" button
**Design:** Multi-step form

```
┌─────────────────────────────────────────────┐
│  Upload New Resource                        │
│  ●─────○─────○  Step 1 of 3                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  STEP 1: Basic Information                  │
│                                             │
│  Resource Title *                           │
│  [________________________________]         │
│                                             │
│  Short Description *                        │
│  [________________________________]         │
│  [________________________________]         │
│  [________________________________]         │
│  Max 200 characters                         │
│                                             │
│  Resource Type *                            │
│  ( ) Lesson Plan                            │
│  ( ) Worksheet/Handout                      │
│  ( ) Activity Guide                         │
│  ( ) Assessment Template                    │
│  ( ) Presentation Slides                    │
│                                             │
│  [Cancel]              [Next Step →]        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Upload New Resource                        │
│  ○─────●─────○  Step 2 of 3                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  STEP 2: Tags & Categories                  │
│                                             │
│  Subject * (Select one or more)             │
│  ☐ Math  ☐ Science  ☐ English              │
│  ☐ Social Studies  ☐ Arts  ☐ PE            │
│  ☐ Other: [____________]                    │
│                                             │
│  Grade Level * (Select all that apply)      │
│  ☐ K-2  ☐ 3-5  ☐ 6-8  ☐ 9-12               │
│                                             │
│  Skills/Topics                              │
│  Popular tags:                              │
│  [fractions] [multiplication] [reading]     │
│  [vocabulary] [science-lab]                 │
│                                             │
│  Add custom tags:                           │
│  [________________] [+ Add]                 │
│                                             │
│  Selected tags:                             │
│  [fractions ×] [practice ×] [grade4 ×]     │
│                                             │
│  [← Back]              [Next Step →]        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Upload New Resource                        │
│  ○─────○─────●  Step 3 of 3                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  STEP 3: Upload Files                       │
│                                             │
│  Upload Your Resource *                     │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │     📤 Drag & Drop Files Here       │   │
│  │     or [Browse Files]               │   │
│  │                                     │   │
│  │  Supported: PDF, DOC, DOCX, PPT,    │   │
│  │  PPTX, ZIP (Max 10MB)               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Uploaded:                                  │
│  ✓ worksheet-pack.pdf (2.4 MB) [×]         │
│                                             │
│  Preview Image (Optional)                   │
│  [Browse Image]                             │
│                                             │
│  Terms & Sharing                            │
│  ☑️ I own this content or have rights      │
│  ☑️ I agree to share under CC-BY license   │
│  ☐ Allow others to modify (remix)          │
│                                             │
│  [← Back]        [Publish Resource 🚀]     │
└─────────────────────────────────────────────┘
```

**After Upload:**
```
┌─────────────────────────────────────────────┐
│  Success! 🎉                                │
│                                             │
│  Your resource "Fraction Worksheet Pack"    │
│  has been published!                        │
│                                             │
│  [View Your Resource]                       │
│  [Upload Another]                           │
│  [Go to Dashboard]                          │
└─────────────────────────────────────────────┘
```

---

### 7. **Teacher Profile Page (NEW)**

**URL:** `/teachers/[username]`
**Purpose:** Public profile showcasing contributions

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Global)                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  👤 Sarah Martinez                                       │
│  4th Grade Science Teacher                               │
│  Member since January 2025                               │
│                                                          │
│  ⭐ 4.8 Rating  |  📚 12 Resources  |  🔽 247 Downloads │
└─────────────────────────────────────────────────────────┘

┌───────────────────┬─────────────────────────────────────┐
│  ABOUT            │  RESOURCES                          │
│                   │                                     │
│  "I'm passionate  │  Sort: Most Popular ▼               │
│  about making     │                                     │
│  science fun      │  ┌───────┐ ┌───────┐ ┌───────┐    │
│  and accessible   │  │ Card  │ │ Card  │ │ Card  │    │
│  for all          │  └───────┘ └───────┘ └───────┘    │
│  learners!"       │                                     │
│                   │  ┌───────┐ ┌───────┐ ┌───────┐    │
│  Specialties:     │  │ Card  │ │ Card  │ │ Card  │    │
│  • Science        │  └───────┘ └───────┘ └───────┘    │
│  • Grade 4-5      │                                     │
│  • Hands-on       │  [Load More]                        │
│                   │                                     │
│  [Follow Teacher] │                                     │
└───────────────────┴─────────────────────────────────────┘
```

---

## 🎨 UI Component Library

### Color Palette (Using Existing)
- **Primary Actions:** `var(--terracotta)` #c96847
- **Success/Positive:** `var(--sage)` #7a9d7e
- **Info/Links:** `var(--navy)` #2c4251
- **Highlights:** `var(--pencil-yellow)` #ffd966
- **Background:** `var(--background)` #fdfcf9

### Key Components to Build

#### 1. **Favorite Heart Button**
```tsx
// Unfavorited state
<button className="favorite-btn">
  <HeartIcon className="text-gray-400 hover:text-terracotta" />
</button>

// Favorited state
<button className="favorite-btn">
  <HeartIcon className="text-terracotta fill-terracotta animate-bounce-once" />
</button>
```

#### 2. **Resource Card**
```tsx
<div className="tool-card"> {/* Reuse existing styling */}
  <img src={preview} alt={title} />
  <h3>{title}</h3>
  <div className="teacher-info">
    <Avatar src={teacher.photo} />
    <span>{teacher.name}</span>
    <Rating value={rating} />
  </div>
  <div className="tags">
    <Badge>{gradeLevel}</Badge>
    <Badge>{subject}</Badge>
  </div>
  <p className="description">{shortDesc}</p>
  <div className="stats">
    <span>🔽 {downloads}</span>
    <span>❤️ {favorites}</span>
  </div>
  <div className="actions">
    <Button>View Details</Button>
    <Button variant="secondary">Download</Button>
    <IconButton icon="heart" />
  </div>
</div>
```

#### 3. **Upload Button (Sticky FAB)**
```tsx
// Floating Action Button (authenticated users only)
<button className="sticky-note upload-fab">
  <UploadIcon /> Upload Resource
</button>
```

#### 4. **Filter Sidebar**
```tsx
// Reuse existing FilterSidebar component structure
// Add resource-specific filters
<div className="sidebar-card">
  <FilterSection title="Resource Type" />
  <FilterSection title="Subject" />
  <FilterSection title="Grade Level" />
  <FilterSection title="Skills" />
</div>
```

---

## 🔄 User Flows

### Flow 1: First-Time Visitor → Registered User

```
1. Land on homepage
   ↓
2. Browse AI tools (no login needed)
   ↓
3. Try to favorite a tool
   ↓
4. Sign Up modal appears
   ↓
5. Fill form → Create account
   ↓
6. Email verification (optional)
   ↓
7. Redirected to dashboard
   ↓
8. Onboarding tooltip: "Welcome! Upload your first resource"
```

### Flow 2: Downloading a Resource

```
NOT SIGNED IN:
Browse resources → Click download → Sign in modal → Sign in → Download starts

SIGNED IN:
Browse resources → Click download → Download starts immediately
```

### Flow 3: Uploading a Resource

```
1. Click "Upload" button (header or dashboard)
   ↓
2. Multi-step form:
   - Step 1: Basic info (title, description, type)
   - Step 2: Tags & categories (subject, grade, skills)
   - Step 3: File upload + preview image
   ↓
3. Review & publish
   ↓
4. Success message with sharing options
   ↓
5. Resource appears in "My Uploads"
```

### Flow 4: Discovering Resources

```
1. Visit /resources page
   ↓
2. See trending/popular resources
   ↓
3. Use filters:
   - Subject
   - Grade level
   - Resource type
   - Skills/tags
   ↓
4. Click resource card → Detail view
   ↓
5. Download or favorite
   ↓
6. See related resources from same teacher
```

---

## 🎯 Success Metrics

### Key Performance Indicators (KPIs)

1. **Adoption Metrics**
   - Sign-up conversion rate: % visitors who create accounts
   - Upload rate: % registered users who upload at least 1 resource
   - Time to first upload: Days from registration to first upload

2. **Engagement Metrics**
   - Favorites per user: Average tools/resources favorited
   - Downloads per resource: Average downloads per uploaded resource
   - Return visits: % users who return within 7 days

3. **Community Health**
   - Active contributors: % users who uploaded in last 30 days
   - Resource quality: Average rating across all resources
   - Discovery rate: % resources discovered via search vs trending

---

## 🚦 MVP vs Future Features

### Phase 1: MVP (Minimum Viable Product)
✅ **INCLUDE:**
- Email/password authentication
- Favorite AI tools (requires login)
- Upload resources (basic form)
- Browse resources (search + basic filters)
- Download resources (requires login)
- Basic teacher profile
- Simple reputation (total downloads + rating)

❌ **EXCLUDE (for now):**
- Google OAuth (add later if needed)
- Comments/reviews system
- Following teachers
- Notifications
- Advanced analytics
- Resource versioning
- Collaborative editing

### Phase 2: Community Features
- Comments & reviews
- Teacher following
- Activity feed
- Email notifications
- Featured resources

### Phase 3: Advanced
- Google/Microsoft OAuth
- Resource collections (playlists)
- Collaborative folders
- Advanced analytics dashboard
- API for external integrations

---

## 🎨 Design System Integration

### Leverage Existing Classroom Aesthetic

**Good News:** Your current design ("Inspired Classroom") is PERFECT for this!

#### Reuse These Patterns:
1. **Tool Cards** → **Resource Cards**
   - Same pushpin effect
   - Same hover animations
   - Add download counter + heart icon

2. **Sidebar Filters** → **Resource Filters**
   - Same planner aesthetic
   - Same binding holes decoration
   - Add resource-specific filters

3. **Form Inputs** → **Upload Form**
   - Same worksheet-style inputs
   - Same blue bottom border
   - Same lined background texture

4. **Buttons** → **Action Buttons**
   - Same gradient primary button
   - Same hover effects
   - Add loading states

#### New Patterns Needed:
1. **Avatar Component**
   - Circular teacher photo
   - Fallback to initials
   - Border with sage color

2. **Rating Stars**
   - Use existing star color: `var(--accent-star)`
   - Animated fill on hover
   - Half-star support

3. **Badge/Tag Component**
   - Similar to category badge
   - Smaller size
   - Multiple colors for different types

4. **Upload Dropzone**
   - Dashed border (hand-drawn style)
   - Drag-and-drop active state
   - Progress indicator

---

## 🔐 Security & Privacy Considerations

### Data Protection
1. **User Files:**
   - Store uploaded files securely (cloud storage)
   - Virus/malware scanning on upload
   - File size limits (10MB per file)
   - File type restrictions (PDF, DOC, PPTX, ZIP only)

2. **User Data:**
   - Password hashing (bcrypt)
   - Email verification (optional but recommended)
   - GDPR compliance (for international users)
   - User can delete account + all uploads

3. **Access Control:**
   - Public resources: Anyone can view/download (after login)
   - Private option: Teacher can mark resources as "draft" or "private"
   - Reporting system: Users can report inappropriate content

### Content Moderation
1. **Automated:**
   - File scanning for viruses
   - Spam detection (repeated uploads)
   - Size/format validation

2. **Manual:**
   - Admin review queue (optional)
   - User reporting mechanism
   - Content takedown process

---

## 📱 Responsive Design Notes

### Mobile Considerations

#### Authentication Modals
- Full-screen on mobile (<640px)
- Simplified form fields
- Larger touch targets

#### Resource Cards
- Stack vertically on mobile
- Larger preview images
- Swipe gestures for favorites

#### Upload Flow
- One field per screen on mobile
- Native file picker
- Progress indicator prominent

#### Filters
- Collapsible accordion on mobile
- "Filter" button opens modal
- Applied filters shown as chips

---

## ⚡ Technical Implementation Notes

### Recommended Tech Stack

#### Frontend (Existing: Next.js + React)
- **Forms:** React Hook Form + Zod validation
- **Uploads:** react-dropzone
- **Auth State:** Context API or Zustand
- **File Preview:** react-pdf-viewer (for PDFs)

#### Backend (To be determined)
Options:
1. **Firebase** (Easiest)
   - Authentication built-in
   - Firestore for data
   - Cloud Storage for files
   - Free tier generous

2. **Supabase** (Recommended)
   - PostgreSQL database
   - Auth built-in
   - Storage built-in
   - Row-level security
   - More control than Firebase

3. **Custom API** (Most flexible)
   - Next.js API routes
   - Prisma ORM
   - AWS S3 for files
   - JWT authentication

#### Recommended: **Supabase**
- Fast setup
- Built-in auth
- SQL database (better for relations)
- File storage included
- Generous free tier

### Database Schema (High-Level)

```sql
-- Users table
users
  - id (uuid)
  - email (string, unique)
  - full_name (string)
  - password_hash (string)
  - grade_level (string)
  - primary_subject (string)
  - created_at (timestamp)
  - avatar_url (string, nullable)

-- Resources table
resources
  - id (uuid)
  - user_id (foreign key)
  - title (string)
  - description (text)
  - resource_type (enum)
  - file_url (string)
  - preview_image_url (string, nullable)
  - download_count (integer, default 0)
  - created_at (timestamp)
  - updated_at (timestamp)

-- Resource tags (many-to-many)
resource_tags
  - resource_id (foreign key)
  - tag_id (foreign key)

tags
  - id (uuid)
  - name (string, unique)
  - category (enum: subject, grade, skill, type)

-- Favorites (many-to-many)
favorites
  - user_id (foreign key)
  - resource_id (foreign key)
  - created_at (timestamp)

-- Tool favorites (separate from resource favorites)
tool_favorites
  - user_id (foreign key)
  - tool_id (integer) // references existing tools.json
  - created_at (timestamp)

-- Ratings
ratings
  - id (uuid)
  - user_id (foreign key)
  - resource_id (foreign key)
  - rating (integer, 1-5)
  - review_text (text, nullable)
  - created_at (timestamp)
```

---

## 🎓 Next Steps for Implementation

### Step 1: Setup Authentication (Priority 1)
1. Choose backend (Supabase recommended)
2. Set up user registration/login
3. Create auth context/provider
4. Add "Sign In" button to header
5. Build Sign In/Sign Up modals
6. Test authentication flow

### Step 2: Favorite Tools (Priority 1)
1. Add heart icon to tool cards
2. Wire up favorite/unfavorite logic
3. Create "My Favorites" page in dashboard
4. Store favorites in database
5. Show favorite count on cards

### Step 3: Resources Database (Priority 2)
1. Design database schema
2. Create resources table + relations
3. Seed with predefined tags
4. Build API endpoints:
   - GET /resources (list with filters)
   - GET /resources/:id (single resource)
   - POST /resources (upload)
   - GET /users/:id/resources (teacher's resources)

### Step 4: Upload Flow (Priority 2)
1. Build upload form (3-step wizard)
2. Integrate file upload to storage
3. Create resource record in database
4. Link tags to resource
5. Generate preview/thumbnail
6. Success confirmation

### Step 5: Browse Resources (Priority 3)
1. Create /resources page
2. Build resource cards
3. Implement search functionality
4. Add filter sidebar
5. Implement pagination/infinite scroll
6. Add sorting options (trending, popular, newest)

### Step 6: Resource Details (Priority 3)
1. Create resource detail page
2. Show full description + metadata
3. Display teacher info
4. Add download button
5. Show related resources
6. Add rating/review section (basic)

### Step 7: Dashboard (Priority 4)
1. Create /dashboard route
2. Build sidebar navigation
3. "My Uploads" section
4. "My Favorites" section
5. Basic stats display
6. Profile settings

### Step 8: Teacher Profiles (Priority 5)
1. Create /teachers/:id route
2. Display teacher info + stats
3. List their uploaded resources
4. Show reputation metrics
5. Public profile view

---

## 📋 Wireframe Summary

**Low-Fidelity Wireframes Created:**
1. ✅ Enhanced Homepage
2. ✅ Sign In/Sign Up Modals
3. ✅ Resources Library Page
4. ✅ Resource Detail Page
5. ✅ My Dashboard
6. ✅ Upload Resource Flow
7. ✅ Teacher Profile Page

**Design System:**
- ✅ Reuses existing "Inspired Classroom" aesthetic
- ✅ Maintains consistent visual language
- ✅ Adds minimal new components

---

## 🎯 Final Recommendations

### For Development Success:

1. **Start Small, Iterate Fast**
   - Build MVP first (auth + favorites + basic upload)
   - Get feedback from 5-10 teachers
   - Iterate based on real usage

2. **Prioritize Ease of Use**
   - 3-click rule: Any action in ≤3 clicks
   - Clear CTAs everywhere
   - Helpful empty states

3. **Build Trust**
   - Clear privacy policy
   - Visible security measures
   - Teacher testimonials/success stories

4. **Foster Community**
   - Highlight top contributors
   - Celebrate milestones (100th upload!)
   - Make sharing feel rewarding

### Success Looks Like:
- Teachers sign up within 2 minutes
- First upload happens within 10 minutes
- Resources are discovered and downloaded
- Teachers return weekly
- Word-of-mouth growth begins

---

## 📞 Questions for Ahmed

Before implementation, please confirm:

1. **Backend Choice:** Firebase, Supabase, or custom? (I recommend Supabase)
2. **Email Verification:** Required or optional on signup?
3. **Google OAuth:** Phase 1 or Phase 2?
4. **Resource Approval:** Auto-publish or admin review queue?
5. **Private Resources:** Allow teachers to keep resources private?

---

**This UX design is ready for implementation! 🚀**

Next step: Review this plan, ask questions, then we can proceed to architecture/development.

---

_Designed with ❤️ for teachers, by Sally (UX Designer)_
_Project: Teachers Tools Hub | Date: 2026-02-02_
