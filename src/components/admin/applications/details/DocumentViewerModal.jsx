import {
  FaTimes,
  FaDownload,
  FaFilePdf,
} from "react-icons/fa";

function DocumentViewerModal({

  open,

  onClose,

  title,

  fileUrl,

}) {

  if (!open) return null;

  const isPdf =
    fileUrl.toLowerCase().endsWith(".pdf");

  return (

    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>

            <h2 className="text-2xl font-bold">

              {title}

            </h2>

            <p className="text-gray-500">

              Document Preview

            </p>

          </div>

          <div className="flex gap-3">

            <a
              href={fileUrl}
              download
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >

              <FaDownload />

              Download

            </a>

            <button
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
            >

              <FaTimes />

              Close

            </button>

          </div>

        </div>

        {/* Preview */}

        <div className="flex-1 bg-gray-100 overflow-auto flex justify-center items-center">

          {isPdf ? (

            <iframe
              src={fileUrl}
              title={title}
              className="w-full h-full"
            />

          ) : (

            <img
              src={fileUrl}
              alt={title}
              className="max-w-full max-h-full object-contain p-5"
            />

          )}

        </div>

      </div>

    </div>

  );

}

export default DocumentViewerModal;