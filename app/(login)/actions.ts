'use server';

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { User, users } from '@/lib/db/schema';
import { setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { validatedAction, validatedActionWithUser } from '@/lib/auth/middleware';

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});
export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;
  await Promise.all([
    setSession({ email, name: '' })
  ]);
  redirect('/dashboard');
});

const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  field_one: z.string(),
  field_two: z.string(),
  field_three: z.string(),
});

const userSchema = z.object({
  email: z.string().email()
});


export const checkUser = validatedAction(userSchema, async (data, formData) => {
  const { email } = data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      success: 'successfully.'
    };
  }

  return {
    error: 'Please try again.',
    email,
  };

})

export async function getUsers(_prevState: any, formData: FormData): Promise<User[]> {

  const listUsers = await db
    .select()
    .from(users)
    .limit(20);

  return listUsers;
}


export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, name, role = '', field_one, field_two, field_three } = data;
  console.log(email);
  
  try {
    const user = await db.insert(users).values({ email, name, role, field_one, field_two, field_three }).returning();
    console.log(user);
    
    await Promise.all([
      setSession(user[0])
    ]);
  } catch (error) {
    console.log(error);

  }
  redirect('/dashboard');
});

export async function signOut() {
  (await cookies()).delete('session');
}

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100)
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {

    // Soft delete
    await db
      .update(users)
      .set({
        email: sql`CONCAT(email, '-', id, '-deleted')` // Ensure email uniqueness
      })
      .where(eq(users.id, user.id));

    (await cookies()).delete('session');
    redirect('/sign-in');
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address')
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;
    await Promise.all([
      db.update(users).set({ name, email }).where(eq(users.id, user.id)),
    ]);

    return { name, success: 'Account updated successfully.' };
  }
);

