// Event-driven architecture models for RxJS streams

export interface AppEvent {
  readonly id: string;
  readonly type: string;
  readonly timestamp: Date;
  readonly source: EventSource;
  readonly data?: any;
  readonly metadata?: EventMetadata;
}

export enum EventSource {
  USER_INTERACTION = 'USER_INTERACTION',
  SYSTEM = 'SYSTEM',
  API = 'API',
  TIMER = 'TIMER',
  EXTERNAL = 'EXTERNAL',
}

export interface EventMetadata {
  userId?: string;
  sessionId?: string;
  correlationId?: string;
  causationId?: string; // Event that caused this event
  version?: number;
}

// Todo-specific events
export enum TodoEventType {
  TODO_ADDED = 'TODO_ADDED',
  TODO_UPDATED = 'TODO_UPDATED',
  TODO_DELETED = 'TODO_DELETED',
  TODO_COMPLETED = 'TODO_COMPLETED',
  TODO_UNCOMPLETED = 'TODO_UNCOMPLETED',
  TODOS_REORDERED = 'TODOS_REORDERED',
  TODOS_FILTERED = 'TODOS_FILTERED',
  TODOS_SEARCHED = 'TODOS_SEARCHED',
  TODOS_BULK_UPDATED = 'TODOS_BULK_UPDATED',
}

// UI events
export enum UIEventType {
  SEARCH_INPUT_CHANGED = 'SEARCH_INPUT_CHANGED',
  FILTER_CHANGED = 'FILTER_CHANGED',
  SORT_CHANGED = 'SORT_CHANGED',
  DRAG_STARTED = 'DRAG_STARTED',
  DRAG_MOVED = 'DRAG_MOVED',
  DRAG_ENDED = 'DRAG_ENDED',
  KEYBOARD_SHORTCUT = 'KEYBOARD_SHORTCUT',
  MODAL_OPENED = 'MODAL_OPENED',
  MODAL_CLOSED = 'MODAL_CLOSED',
}

// System events
export enum SystemEventType {
  APP_INITIALIZED = 'APP_INITIALIZED',
  DATA_LOADED = 'DATA_LOADED',
  DATA_SAVED = 'DATA_SAVED',
  SYNC_STARTED = 'SYNC_STARTED',
  SYNC_COMPLETED = 'SYNC_COMPLETED',
  SYNC_FAILED = 'SYNC_FAILED',
  CONNECTION_LOST = 'CONNECTION_LOST',
  CONNECTION_RESTORED = 'CONNECTION_RESTORED',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
}

// Drag and drop specific events
export interface DragEvent extends AppEvent {
  type:
    | UIEventType.DRAG_STARTED
    | UIEventType.DRAG_MOVED
    | UIEventType.DRAG_ENDED;
  data: {
    todoId: string;
    position: { x: number; y: number };
    targetIndex?: number;
    sourceIndex?: number;
  };
}

// Search events with debouncing support
export interface SearchEvent extends AppEvent {
  type: UIEventType.SEARCH_INPUT_CHANGED;
  data: {
    query: string;
    previousQuery?: string;
    searchType: 'text' | 'tag' | 'combined';
  };
}

// Command events for undo/redo
export interface CommandEvent extends AppEvent {
  data: {
    commandId: string;
    commandType: string;
    success: boolean;
    error?: Error;
    rollbackData?: any;
  };
}

// Mouse event stream models for drag-drop
export interface MouseEventStream {
  mouseDown$: MouseEvent;
  mouseMove$: MouseEvent;
  mouseUp$: MouseEvent;
  element: HTMLElement;
}

export interface DragDropEventStream {
  start$: DragEvent;
  move$: DragEvent;
  end$: DragEvent;
  cancel$: DragEvent;
}

// Keyboard event models
export interface KeyboardEventData {
  key: string;
  code: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  target: EventTarget;
}

export interface KeyboardShortcut {
  keys: string[];
  description: string;
  action: () => void;
  preventDefault?: boolean;
  context?: string; // Where this shortcut is active
}

// Error event models
export interface ErrorEvent extends AppEvent {
  type: SystemEventType.ERROR_OCCURRED;
  data: {
    error: Error;
    context?: string;
    recoverable: boolean;
    userMessage?: string;
    technicalDetails?: any;
  };
}

// Sync event models
export interface SyncEvent extends AppEvent {
  type:
    | SystemEventType.SYNC_STARTED
    | SystemEventType.SYNC_COMPLETED
    | SystemEventType.SYNC_FAILED;
  data: {
    itemIds: string[];
    direction: 'upload' | 'download' | 'bidirectional';
    conflicts?: ConflictResolution[];
    error?: Error;
  };
}

export interface ConflictResolution {
  itemId: string;
  strategy: 'local' | 'remote' | 'merge' | 'manual';
  resolvedData?: any;
}

// Factory functions for creating events
export function createAppEvent(
  type: string,
  source: EventSource,
  data?: any,
  metadata?: EventMetadata
): AppEvent {
  return {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date(),
    source,
    data,
    metadata,
  };
}

export function createTodoEvent(
  type: TodoEventType,
  data: any,
  metadata?: EventMetadata
): AppEvent {
  return createAppEvent(type, EventSource.USER_INTERACTION, data, metadata);
}

export function createUIEvent(
  type: UIEventType,
  data: any,
  metadata?: EventMetadata
): AppEvent {
  return createAppEvent(type, EventSource.USER_INTERACTION, data, metadata);
}

export function createSystemEvent(
  type: SystemEventType,
  data?: any,
  metadata?: EventMetadata
): AppEvent {
  return createAppEvent(type, EventSource.SYSTEM, data, metadata);
}

// Event stream configuration
export interface StreamConfig {
  debounceTime?: number;
  distinctUntilChanged?: boolean;
  throttleTime?: number;
  bufferTime?: number;
  takeUntil?: any;
}

// Predefined stream configurations
export const SEARCH_STREAM_CONFIG: StreamConfig = {
  debounceTime: 300,
  distinctUntilChanged: true,
};

export const DRAG_STREAM_CONFIG: StreamConfig = {
  throttleTime: 16, // ~60fps
};

export const KEYBOARD_STREAM_CONFIG: StreamConfig = {
  debounceTime: 50,
  distinctUntilChanged: true,
};

// Event bus interface for type-safe event handling
export interface EventBus {
  emit<T extends AppEvent>(event: T): void;
  on<T extends AppEvent>(eventType: string): Observable<T>;
  off(eventType: string): void;
  clear(): void;
}

// Observable-based event handlers
export type EventHandler<T extends AppEvent> = (event: T) => void;
export type AsyncEventHandler<T extends AppEvent> = (
  event: T
) => Observable<any>;

import { Observable } from 'rxjs';
