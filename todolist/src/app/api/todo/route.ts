import { NextResponse } from 'next/server';
import { createTodo, getTodo, updateTodo } from '@/app/service/todoService';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    let todo;
    if (body.id) {
      todo = await updateTodo(body.id, body);
    } else {
      todo = await createTodo(body);
    }
    return NextResponse.json({
      data: todo,
      status: 200,
      ok: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to add new to do',
      message: error.message,
      status: 500,
      ok: false,
    });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
    }
    
    const users = await getTodo(parsedUserId);
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching todos:', error);

    return NextResponse.json(
      { message: 'Failed to fetch data', error: error.message },
      { status: 500 }
    );
  }
}

