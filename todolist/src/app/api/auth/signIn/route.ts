import { NextResponse } from 'next/server';
import { authenticateUser } from '@/app/service/userService';
import { generateToken } from '../../users/route';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  try {
    const user = await authenticateUser(email, password);
    const res = await generateToken(user);

    return NextResponse.json({
      data: { ...user, token: res.token },
      status: 200,
      ok: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to sign in user',
      message: error.message,
      status: 500,
      ok: false,
    });
  }
}
