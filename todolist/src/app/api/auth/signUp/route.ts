import { NextResponse } from 'next/server';
import { createUser } from '@/app/service/userService';
import { UserDto } from '@/app/DTOs/user';
import { generateToken } from '../../users/route';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  try {
    const user: UserDto = await createUser(name, email, password);
    const res = await generateToken(user);
    return NextResponse.json({ data: { ...user, token: res.token }, status: 201, ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user', message: error, status: 500, ok: false });
  }
}