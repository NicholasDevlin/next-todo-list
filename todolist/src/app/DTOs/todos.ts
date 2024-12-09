export interface TodosDto {
  id: number;
  title: string | null;  
  content: string | null;
  authorId: number;
  status: TodoStatus;
  deletedAt: Date | null;
}

export enum TodoStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED"
}