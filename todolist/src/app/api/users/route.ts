import { NextResponse } from 'next/server';
import { getUser, createUser, authenticateUser } from '@/app/service/userService';
import jwt from 'jsonwebtoken';
import { UserDto } from '@/app/DTOs/user';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    const users = await getUser();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);

    return NextResponse.json(
      { message: 'Failed to fetch users', error: error },
      { status: 500 }
    );
  }
}

export async function generateToken(user: UserDto) {
  if (!JWT_SECRET) {
    throw new Error('Failed generate token');
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '10h' });

  return { user, token };
}
