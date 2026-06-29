import { ChevronLeft, ChevronRight } from "lucide-react";
interface Props {
  total: number;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage?: (n: number) => void;
}

export default function Pagination({ total, page, perPage, setPage, setPerPage }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  // smart pagination (with ...)
  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (item, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-200 pt-4">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        {/* TEXT FIXED */}
        <p>
          Showing {start}-{end} of {total} items
        </p>

        {/* DROPDOWN FIXED */}
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select
            aria-label="Items per page"
            value={perPage}
            onChange={(e) => {
              setPerPage?.(Number(e.target.value));
              setPage(1); // reset page when changing size
            }}
            className="border rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>per page</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">
        {/* PREVIOUS */}
        <button
          aria-label="Previous page"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-md border transition-all
duration-200
hover:bg-gray-100
hover:shadow-sm text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <ChevronLeft />
        </button>

        {/* PAGE NUMBERS */}
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2 text-gray-400 ">
              ...
            </span>
          ) : (
            <button
              key={i}
              aria-label={`Go to page ${p}`}
              aria-current={page === p ? "page" : undefined}
              onClick={() => setPage(p as number)}
              className={`px-3 py-1 rounded-md text-sm ${
                page === p ? "bg-purple-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ),
        )}

        {/* NEXT */}
        <button
          aria-label="Next page"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded-md border transition-all
duration-200
hover:bg-gray-100
hover:shadow-sm text-sm disabled:opacity-40  focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
