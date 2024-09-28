'use client';

import { Flex, Button } from '@chakra-ui/react';
import { Paging } from '@frontend/services/types/pagination';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  paging: Paging;
}

function Pagination({ paging }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10);
  const totalPages = paging?.totalPages || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, {
      scroll: true,
    });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 10;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    const startPage = Math.max(1, currentPage - halfMaxPagesToShow);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pageNumbers.push(
        <Button
          key={1}
          onClick={() => handlePageChange(1)}
          variant={currentPage === 1 ? 'solid' : 'outline'}
          mx={1}
          aria-current={currentPage === 1 ? 'page' : undefined}
        >
          1
        </Button>,
      );
      if (startPage > 2) {
        pageNumbers.push(
          <Button
            key="start-ellipsis"
            onClick={() => handlePageChange(startPage - 1)}
            variant="outline"
            mx={1}
          >
            ...
          </Button>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={currentPage === i ? 'solid' : 'outline'}
          mx={1}
        >
          {i}
        </Button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <Button
            key="end-ellipsis"
            onClick={() => handlePageChange(endPage + 1)}
            variant="outline"
            mx={1}
          >
            ...
          </Button>,
        );
      }
      pageNumbers.push(
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          variant={currentPage === totalPages ? 'solid' : 'outline'}
          mx={1}
        >
          {totalPages}
        </Button>,
      );
    }

    return pageNumbers;
  };

  if (paging.totalPages > 1) {
    return (
      <Flex justifyContent="center" mt={8}>
        <Flex gap={4} alignItems="center">
          {currentPage > 1 && (
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              variant="outline"
              mx={1}
            >
              Previous
            </Button>
          )}
          {renderPageNumbers()}
          {currentPage < totalPages && (
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              variant="outline"
              mx={1}
            >
              Next
            </Button>
          )}
        </Flex>
      </Flex>
    );
  }
  return null;
}

export default Pagination;
