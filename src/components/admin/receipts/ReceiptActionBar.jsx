import {
  FaArrowLeft,
  FaPrint,
  FaFilePdf,
  FaEnvelope,
  FaArchive,
  FaUndo,
} from "react-icons/fa";

export default function ReceiptActionBar({

  receipt,

  onBack,

  onPrint,

  onDownloadPDF,

  onEmail,

  onArchive,

  onRestore,

}) {

  return (

    <div className="bg-white rounded-2xl border shadow-sm p-6">

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">

        {/* Left */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border hover:bg-gray-100 transition"
        >

          <FaArrowLeft />

          Back to Receipts

        </button>

        {/* Right */}

        <div className="flex flex-wrap justify-center gap-3">

          <button
            onClick={() => onPrint(receipt)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >

            <FaPrint />

            Print Receipt

          </button>

          <button
            onClick={() => onDownloadPDF(receipt)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl transition"
          >

            <FaFilePdf />

            Download PDF

          </button>

          <button
            onClick={() => onEmail(receipt)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl transition"
          >

            <FaEnvelope />

            Email Receipt

          </button>

          {!receipt?.is_archived ? (

            <button
              onClick={() => onArchive(receipt)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl transition"
            >

              <FaArchive />

              Archive

            </button>

          ) : (

            <button
              onClick={() => onRestore(receipt)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition"
            >

              <FaUndo />

              Restore

            </button>

          )}

        </div>

      </div>

    </div>

  );

}