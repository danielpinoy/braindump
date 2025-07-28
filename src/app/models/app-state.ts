import { Todo, PendingTodo } from './todo';
import { SearchCriteria, SortOptions } from './filter';
import { CommandHistory } from './command';

// Main application state interface
export interface AppState {
  todos: TodoState;
  ui: UIState;
  history: HistoryState;
  sync: SyncState;
}

// Todo-specific state
export interface TodoState {
  items: Todo[];
  pendingItems: PendingTodo[]; // For optimistic updates
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  selectedIds: Set<string>; // For bulk operations
}

// UI state for the application
export interface UIState {
  search: SearchCriteria;
  sort: SortOptions;
  filters: {
    active: boolean;
    search: boolean;
    tags: boolean;
  };
  dragDrop: DragDropState;
  keyboard: KeyboardState;
  notifications: NotificationState[];
}

// Drag and drop state
export interface DragDropState {
  isDragging: boolean;
  draggedItemId: string | null;
  dropTargetId: string | null;
  dragStartPosition: { x: number; y: number } | null;
  currentPosition: { x: number; y: number } | null;
}

// Keyboard shortcuts state
export interface KeyboardState {
  activeShortcuts: Set<string>;
  modifierKeys: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
  };
}

// Notification system state
export interface NotificationState {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  duration?: number; // Auto-dismiss after N ms
  actions?: NotificationAction[];
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// Command history state
export interface HistoryState {
  commands: CommandHistory;
  canUndo: boolean;
  canRedo: boolean;
  lastExecutedCommand: string | null;
}

// Synchronization state for offline/online scenarios
export interface SyncState {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingSyncItems: string[]; // Todo IDs pending sync
  syncInProgress: boolean;
  syncError: string | null;
}

// Loading states for different operations
export interface LoadingState {
  [key: string]: boolean;
}

// Error states with context
export interface ErrorState {
  message: string;
  code?: string;
  timestamp: Date;
  context?: any;
  recoverable: boolean;
}

// Factory functions for creating initial states
export function createInitialTodoState(): TodoState {
  return {
    items: [],
    pendingItems: [],
    loading: false,
    error: null,
    lastUpdated: null,
    selectedIds: new Set(),
  };
}

export function createInitialUIState(): UIState {
  return {
    search: {
      text: '',
      filter: 'all' as any,
      tags: [],
    },
    sort: {
      field: 'order' as any,
      direction: 'asc' as any,
    },
    filters: {
      active: false,
      search: false,
      tags: false,
    },
    dragDrop: {
      isDragging: false,
      draggedItemId: null,
      dropTargetId: null,
      dragStartPosition: null,
      currentPosition: null,
    },
    keyboard: {
      activeShortcuts: new Set(),
      modifierKeys: {
        ctrl: false,
        shift: false,
        alt: false,
        meta: false,
      },
    },
    notifications: [],
  };
}

export function createInitialHistoryState(): HistoryState {
  return {
    commands: {
      undoStack: [],
      redoStack: [],
      maxHistorySize: 50,
    },
    canUndo: false,
    canRedo: false,
    lastExecutedCommand: null,
  };
}

export function createInitialSyncState(): SyncState {
  return {
    isOnline: navigator.onLine,
    lastSyncTime: null,
    pendingSyncItems: [],
    syncInProgress: false,
    syncError: null,
  };
}

export function createInitialAppState(): AppState {
  return {
    todos: createInitialTodoState(),
    ui: createInitialUIState(),
    history: createInitialHistoryState(),
    sync: createInitialSyncState(),
  };
}

// State update helpers
export function updateTodoState(
  currentState: TodoState,
  updates: Partial<TodoState>
): TodoState {
  return {
    ...currentState,
    ...updates,
    selectedIds: updates.selectedIds || currentState.selectedIds,
  };
}

export function updateUIState(
  currentState: UIState,
  updates: Partial<UIState>
): UIState {
  return {
    ...currentState,
    ...updates,
  };
}

// Selectors for computed state
export function getVisibleTodos(state: AppState): Todo[] {
  const { items } = state.todos;
  const { search, sort } = state.ui;

  // Apply filters
  let filtered = items.filter((todo) => {
    // Apply search criteria here
    return true; // Simplified for now
  });

  // Apply sorting
  filtered.sort((a, b) => {
    // Apply sort logic here
    return a.order - b.order; // Simplified for now
  });

  return filtered;
}

export function getTodoStats(state: AppState): {
  total: number;
  completed: number;
  active: number;
  pending: number;
} {
  const { items, pendingItems } = state.todos;

  return {
    total: items.length,
    completed: items.filter((todo) => todo.completed).length,
    active: items.filter((todo) => !todo.completed).length,
    pending: pendingItems.length,
  };
}
