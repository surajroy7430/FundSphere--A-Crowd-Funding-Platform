import { memo, useMemo, useCallback, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

const PaginationControl = ({ data = [], pageSize = 10, children }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(
    () => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [data, currentPage, pageSize]
  );

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    },
    [totalPages]
  );

  if (!data.length) return null;

  return (
    <>
      {children(paginatedData)}

      <div className="flex items-center justify-between gap-3">
        <p
          className="flex-1 whitespace-nowrap text-sm text-muted-foreground"
          aria-live="polite"
        >
          Page {currentPage} of {totalPages}
        </p>
        <Pagination className="w-auto mb-5">
          <PaginationContent className="gap-3">
            <PaginationItem>
              <Button
                variant="outline"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default memo(PaginationControl);
