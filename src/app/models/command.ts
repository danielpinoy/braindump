import { Observable } from 'rxjs';
import { Todo, UpdateTodoRequest } from './todo';

// Base command interface for undo/redo functionality
export interface Command {
  readonly id: string;
  readonly type: CommandType;
  readonly description: string;
  readonly timestamp: Date;

  // Execute the command (async to support API calls)
  execute(): Observable<CommandResult>;

  // Undo the command (async to support API calls)
  undo(): Observable<CommandResult>;

  // Check if command can be undone
  canUndo(): boolean;

  // Get metadata about the command for history display
  getMetadata(): CommandMetadata;
}

export enum CommandType {
  ADD_TODO = 'ADD_TODO',
  DELETE_TODO = 'DELETE_TODO',
  UPDATE_TODO = 'UPDATE_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  REORDER_TODOS = 'REORDER_TODOS',
  BULK_DELETE = 'BULK_DELETE',
  BULK_TOGGLE = 'BULK_TOGGLE',
}

export interface CommandResult {
  success: boolean;
  data?: any;
  error?: Error;
  rollbackData?: any; // Data needed for rollback if command fails
}

export interface CommandMetadata {
  affectedTodoIds: string[];
  undoable: boolean;
  batchId?: string; // For grouping related commands
}

// Specific command data interfaces
export interface AddTodoCommandData {
  text: string;
  priority?: string;
  tags?: string[];
}

export interface DeleteTodoCommandData {
  todoId: string;
  todo?: Todo; // Stored for undo
}

export interface UpdateTodoCommandData {
  todoId: string;
  updates: UpdateTodoRequest;
  previousValues?: Partial<Todo>; // Stored for undo
}

export interface ToggleTodoCommandData {
  todoId: string;
  previousCompleted?: boolean; // Stored for undo
}

export interface ReorderTodosCommandData {
  todoId: string;
  fromIndex: number;
  toIndex: number;
  previousOrder?: number; // Stored for undo
}

export interface BulkDeleteCommandData {
  todoIds: string[];
  todos?: Todo[]; // Stored for undo
}

export interface BulkToggleCommandData {
  todoIds: string[];
  newCompletedState: boolean;
  previousStates?: Map<string, boolean>; // Stored for undo
}

// Command history for undo/redo stack
export interface CommandHistory {
  undoStack: Command[];
  redoStack: Command[];
  maxHistorySize: number;
}

// Factory function for creating command history
export function createCommandHistory(maxSize: number = 50): CommandHistory {
  return {
    undoStack: [],
    redoStack: [],
    maxHistorySize: maxSize,
  };
}

// Command execution options
export interface CommandExecutionOptions {
  optimistic?: boolean; // Whether to apply changes optimistically
  skipHistory?: boolean; // Whether to skip adding to undo history
  batchId?: string; // Group commands together
  timeout?: number; // Command timeout in milliseconds
}

// Error types for command execution
export enum CommandErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface CommandError extends Error {
  type: CommandErrorType;
  commandId: string;
  retryable: boolean;
  context?: any;
}

// Helper function to create command errors
export function createCommandError(
  type: CommandErrorType,
  message: string,
  commandId: string,
  retryable: boolean = false,
  context?: any
): CommandError {
  const error = new Error(message) as CommandError;
  error.type = type;
  error.commandId = commandId;
  error.retryable = retryable;
  error.context = context;
  return error;
}
