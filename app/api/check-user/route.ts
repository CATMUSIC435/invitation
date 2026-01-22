import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/db/schema';
import { db } from '@/lib/db/drizzle';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ success: email });
    }

    return NextResponse.json({
      error: 'Please try again.',
      email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
