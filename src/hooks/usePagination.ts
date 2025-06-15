
import { useState, useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export const usePagination = ({ 
  totalItems, 
  itemsPerPage, 
  initialPage = 1 
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;
  
  const goToNext = () => {
    if (canGoNext) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevious = () => {
    if (canGoPrevious) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const reset = () => {
    setCurrentPage(1);
  };
  
  const paginatedData = useMemo(() => ({
    startIndex,
    endIndex,
    currentPage,
    totalPages,
    canGoNext,
    canGoPrevious
  }), [startIndex, endIndex, currentPage, totalPages, canGoNext, canGoPrevious]);
  
  return {
    ...paginatedData,
    goToNext,
    goToPrevious,
    goToPage,
    reset
  };
};
