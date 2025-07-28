import { Todo } from './todo';
export enum TodoFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  HIGH_PRIORITY = 'high_priority',
  MEDIUM_PRIORITY = 'medium_priority',
  LOW_PRIORITY = 'low_priority',
}

export interface SearchCriteria {
  text: string;
  filter: TodoFilter;
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SortOptions {
  field: TodoSortField;
  direction: SortDirection;
}

export enum TodoSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TEXT = 'text',
  PRIORITY = 'priority',
  ORDER = 'order',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

// Default search criteria
export const DEFAULT_SEARCH_CRITERIA: SearchCriteria = {
  text: '',
  filter: TodoFilter.ALL,
  tags: [],
};

// Default sort options
export const DEFAULT_SORT_OPTIONS: SortOptions = {
  field: TodoSortField.ORDER,
  direction: SortDirection.ASC,
};

// Helper functions for filtering
export function createSearchCriteria(
  text: string = '',
  filter: TodoFilter = TodoFilter.ALL,
  tags: string[] = []
): SearchCriteria {
  return {
    text: text.trim().toLowerCase(),
    filter,
    tags: tags.map((tag) => tag.trim().toLowerCase()),
  };
}

export function isFilterMatch(todo: Todo, criteria: SearchCriteria): boolean {
  // Text search
  if (criteria.text && !todo.text.toLowerCase().includes(criteria.text)) {
    return false;
  }

  // Status filter
  switch (criteria.filter) {
    case TodoFilter.ACTIVE:
      if (todo.completed) return false;
      break;
    case TodoFilter.COMPLETED:
      if (!todo.completed) return false;
      break;
    case TodoFilter.HIGH_PRIORITY:
      if (todo.priority !== 'high') return false;
      break;
    case TodoFilter.MEDIUM_PRIORITY:
      if (todo.priority !== 'medium') return false;
      break;
    case TodoFilter.LOW_PRIORITY:
      if (todo.priority !== 'low') return false;
      break;
    case TodoFilter.ALL:
    default:
      break;
  }

  // Tag filter
  if (criteria.tags.length > 0) {
    const todoTags = todo.tags || [];
    const hasAllTags = criteria.tags.every((tag) =>
      todoTags.some((todoTag) => todoTag.includes(tag))
    );
    if (!hasAllTags) return false;
  }

  // Date range filter
  if (criteria.dateRange) {
    const todoDate = todo.createdAt;
    if (
      todoDate < criteria.dateRange.start ||
      todoDate > criteria.dateRange.end
    ) {
      return false;
    }
  }

  return true;
}
