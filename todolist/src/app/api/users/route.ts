import { NextResponse } from 'next/server';
import { getUser, createUser } from '@/app/service/user/service';
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

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  try {
    const user: UserDto = await createUser(name, email, password);
    const res = await generateToken(user);
    return NextResponse.json({...user, token: res.token}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user', message: error, status: 500 });
  }
}

export async function generateToken(user :UserDto) {
  if (!JWT_SECRET) {
    throw new Error('Failed generate token');
  }
  // const user = await prisma.user.findUnique({ where: { email } });

  // if (!user) {
  //   throw new Error('User not found');
  // }

  // const isPasswordValid = await bcrypt.compare(password, user.password);

  // if (!isPasswordValid) {
  //   throw new Error('Invalid credentials');
  // }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '10h' });

  return { user, token };
}
