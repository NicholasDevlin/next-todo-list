import { TodosDto, TodoStatus } from '@/app/DTOs/todos';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTodo(): Promise<TodosDto[]> {
  const todos = await prisma.todos.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      status: true
    },
  });

  return todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    content: todo.content,
    authorId: todo.authorId,
    status: todo.status as TodoStatus, 
  }));
}

export async function createTodo(data: TodosDto) {
  const todo = await prisma.todos.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      status: data.status
    },
  });

  return todo;
}

export async function updateTodo(id: number, data: TodosDto) {
  const updatedTodo = await prisma.todos.update({
    where: {
      id: id,
    },
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      status: data.status,
    },
  });

  return updatedTodo;
}

async function main() {
  try {
    await getTodo();
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
