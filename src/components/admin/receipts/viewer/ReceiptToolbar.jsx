import {
  FaArrowLeft,
  FaPrint,
  FaFilePdf,
  FaEnvelope,
  FaArchive,
  FaUndo,
} from "react-icons/fa";

export default function ReceiptToolbar({
  receipt,
  onBack,
  onPrint,
  onDownloadPDF,
  onEmail,
  onArchive,
  onRestore,
}) {
  return (
    <div className="sticky bottom-5 z-40">

      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl">

        <div className="flex flex-wrap items-center justify-between gap-4 p-5">

          {/* Left Section */}

          <div className="flex items-center gap-3">

            <button
              onClick={onBack}
              className="
                flex items-center gap-2
                px-5 py-2.5
                rounded-lg
                bg-slate-100
                hover:bg-slate-200
                transition
              "
            >
              <FaArrowLeft />

              Back
            </button>

            <div className="hidden md:block h-8 border-l border-gray-300"></div>

            <div>

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Receipt Number
              </p>

              <p className="font-semibold text-slate-700">
                {receipt.receipt_code}
              </p>

            </div>

          </div>

          {/* Right Section */}

          <div className="flex flex-wrap items-center gap-3">

            <button
              onClick={onPrint}
              className="
                flex items-center gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-5 py-2.5
                rounded-lg
                transition
              "
            >
              <FaPrint />

              Print
            </button>

            <button
              onClick={onDownloadPDF}
              className="
                flex items-center gap-2
                bg-red-600
                hover:bg-red-700
                text-white
                px-5 py-2.5
                rounded-lg
                transition
              "
            >
              <FaFilePdf />

              PDF
            </button>

            <button
              onClick={onEmail}
              className="
                flex items-center gap-2
                bg-green-600
                hover:bg-green-700
                text-white
                px-5 py-2.5
                rounded-lg
                transition
              "
            >
              <FaEnvelope />

              Email
            </button>

            {!receipt.is_archived ? (

              <button
                onClick={onArchive}
                className="
                  flex items-center gap-2
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  px-5 py-2.5
                  rounded-lg
                  transition
                "
              >
                <FaArchive />

                Archive
              </button>

            ) : (

              <button
                onClick={onRestore}
                className="
                  flex items-center gap-2
                  bg-purple-600
                  hover:bg-purple-700
                  text-white
                  px-5 py-2.5
                  rounded-lg
                  transition
                "
              >
                <FaUndo />

                Restore
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}