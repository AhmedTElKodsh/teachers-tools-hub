import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const validPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (password === validPassword) {
      // Logic for Next.js 15+ cookies() is async, but this project is on 16.1.4 so strictly async
      const cookieStore = await cookies();
      cookieStore.set('admin_token', 'valid_token', { 
        httpOnly: true, // Not accessible via JS
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
