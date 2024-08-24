import type { ParsedQs } from 'qs';

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export default function parsePaginationParams(
  query: ParsedQs,
): PaginationParams {
  let page: number | undefined;
  let pageSize: number | undefined;

  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 10;

  if (
    typeof query.page === 'number' ||
    (typeof query.page === 'string' && isInt(query.page))
  ) {
    page = Number(query.page);
    if (page < 1) {
      page = DEFAULT_PAGE;
    }
  }

  if (
    typeof query.pageSize === 'number' ||
    (typeof query.pageSize === 'string' && isInt(query.pageSize))
  ) {
    pageSize = Number(query.pageSize);
    if (pageSize < 1) {
      pageSize = DEFAULT_PAGE_SIZE;
    }
  }

  return {
    page,
    pageSize,
  };
}

function isInt(value: string): boolean {
  const number = Number(value);
  return !Number.isNaN(number) && Number.isInteger(number);
}
