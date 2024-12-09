import { TodosDto, TodoStatus } from '@/app/DTOs/todos';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTodo(userId: number, page: number) {
  const skip = (page - 1) * 12;  
  const take = 12;  
  
  const todos = await prisma.todos.findMany({
    where: {
      authorId: userId,
      deletedAt: null, 
    },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      status: true,
      deletedAt: true,
    },
    skip: skip,  
    take: take,  
  });

  const totalCount = await prisma.todos.count({
    where: {
      authorId: userId,
      deletedAt: null,
    }
  });

  return {
    todos,
    totalCount,  
  };
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
