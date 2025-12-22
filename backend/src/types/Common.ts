export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export enum ESortOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
}
