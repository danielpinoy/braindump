export interface Todo {
  readonly id: string;
  text: string;
  completed: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  priority: TodoPriority;
  order: number; // For drag-drop reordering
  tags?: string[]; // Optional categorization
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface CreateTodoRequest {
  text: string;
  priority?: TodoPriority;
  tags?: string[];
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
  priority?: TodoPriority;
  tags?: string[];
}

// For optimistic updates - represents a todo before server confirmation
export interface PendingTodo extends Todo {
  readonly isPending: true;
  readonly tempId: string; // Temporary ID until server assigns real one
}

// Factory function for creating new todos
export function createTodo(request: CreateTodoRequest): Todo {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    text: request.text.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
    priority: request.priority ?? TodoPriority.MEDIUM,
    order: Date.now(), // Default ordering by creation time
    tags: request.tags?.map((tag) => tag.trim().toLowerCase()) ?? [],
  };
}

// Helper function for creating pending todos during optimistic updates
export function createPendingTodo(request: CreateTodoRequest): PendingTodo {
  const baseTodo = createTodo(request);
  return {
    ...baseTodo,
    isPending: true,
    tempId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
}

// Type guards
export function isPendingTodo(todo: Todo | PendingTodo): todo is PendingTodo {
  return 'isPending' in todo && todo.isPending === true;
}

export function isValidTodo(obj: any): obj is Todo {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.completed === 'boolean' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date &&
    Object.values(TodoPriority).includes(obj.priority) &&
    typeof obj.order === 'number'
  );
}
