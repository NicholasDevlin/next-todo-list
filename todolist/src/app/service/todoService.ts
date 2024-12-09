import { TodosDto, TodoStatus } from '@/app/DTOs/todos';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTodo(authorId: number): Promise<TodosDto[]> {
  const todos = await prisma.todos.findMany({
    where: {
      authorId: authorId,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      status: true,
      deletedAt: true
    },
  });

  return todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    content: todo.content,
    authorId: todo.authorId,
    status: todo.status as TodoStatus,
    deletedAt: todo.deletedAt
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
      deletedAt: data.deletedAt
    },
  });

  return updatedTodo;
}

async function main() {
  try {
    // await getTodo();
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
