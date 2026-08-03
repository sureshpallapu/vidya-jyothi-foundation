import { FaFileInvoiceDollar } from "react-icons/fa";

export default function ReceiptEmptyState() {

  return (

    <div className="bg-white rounded-xl border shadow-sm p-16">

      <div className="flex flex-col items-center">

        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">

          <FaFileInvoiceDollar
            size={40}
            className="text-indigo-600"
          />

        </div>

        <h2 className="text-2xl font-bold mt-6">

          No Receipts Found

        </h2>

        <p className="text-gray-500 mt-3 max-w-md text-center">

          There are no receipts matching your search criteria.
          Try changing the filters or generate a new receipt.

        </p>

      </div>

    </div>

  );

}