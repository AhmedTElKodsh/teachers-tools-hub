# Form Submission Setup Guide

The website now includes two interactive forms:

1. **Suggest a Tool** - Teachers can suggest new AI tools
2. **Report an Issue** - Teachers can report problems with tools or the website

## Current Status

The forms are fully functional on the frontend and will display success/error messages. However, the backend currently only logs submissions to the console.

## Setup Options

Choose one of the following methods to handle form submissions:

### Option 1: Email Service (Recommended)

Use a service like [Resend](https://resend.com) (free tier: 100 emails/day):

1. Sign up at https://resend.com
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=your_api_key_here
   ```
4. Uncomment the email code in:
   - `web/app/api/suggest-tool/route.ts`
   - `web/app/api/report-issue/route.ts`
5. Update the email addresses in the code

### Option 2: Supabase Database

Store submissions in a database:

1. Create two tables in Supabase:

   ```sql
   -- Tool suggestions table
   CREATE TABLE tool_suggestions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     tool_name TEXT NOT NULL,
     tool_url TEXT NOT NULL,
     category TEXT NOT NULL,
     description TEXT NOT NULL,
     email TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Issue reports table
   CREATE TABLE issue_reports (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     issue_type TEXT NOT NULL,
     tool_name TEXT,
     description TEXT NOT NULL,
     email TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. Update the API routes to use Supabase client

### Option 3: GitHub Issues (Programmatic)

Automatically create GitHub issues:

1. Create a GitHub Personal Access Token
2. Add to `.env.local`:
   ```
   GITHUB_TOKEN=your_token_here
   GITHUB_REPO=AhmedTElKodsh/teachers-tools-hub
   ```
3. Use the GitHub API in the route handlers

### Option 4: Webhook/Discord/Slack

Send notifications to a webhook:

1. Create a webhook URL in Discord/Slack
2. Add to `.env.local`:
   ```
   WEBHOOK_URL=your_webhook_url
   ```
3. Send POST requests to the webhook

## Testing

To test the forms locally:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Click "اقترح أداة" (Suggest Tool) or "ابلغ عنها هنا" (Report it here)

3. Fill out the form and submit

4. Check the console logs to see the submission data

## Form Features

- ✅ Bilingual support (English/Arabic)
- ✅ RTL support for Arabic
- ✅ Form validation
- ✅ Loading states
- ✅ Success/error messages
- ✅ Modal dialogs
- ✅ Responsive design
- ✅ Dark mode support

## Next Steps

1. Choose a submission method from the options above
2. Implement the backend integration
3. Test thoroughly
4. Deploy to production
