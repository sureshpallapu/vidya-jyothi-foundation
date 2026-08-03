import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function ReceiptPagination({
  pagination,
  onPageChange,
}) {

  const {
    page,
    totalPages,
    total,
    limit,
  } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white rounded-xl shadow border p-4">

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Left */}

        <div className="text-sm text-gray-600">

          Showing

          <span className="font-semibold mx-1">
            {(page - 1) * limit + 1}
          </span>

          to

          <span className="font-semibold mx-1">
            {Math.min(page * limit, total)}
          </span>

          of

          <span className="font-semibold mx-1">
            {total}
          </span>

          receipts

        </div>

        {/* Right */}

        <div className="flex items-center gap-2">

          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="border rounded-lg px-3 py-2 disabled:opacity-40 hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => (

              <button
                key={index}
                onClick={() => onPageChange(index + 1)}
                className={`w-10 h-10 rounded-lg border transition
                  ${
                    page === index + 1
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {index + 1}
              </button>

            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="border rounded-lg px-3 py-2 disabled:opacity-40 hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>

        </div>

      </div>

    </div>
  );
}