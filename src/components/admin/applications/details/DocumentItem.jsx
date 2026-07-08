import {
  FaEye,
  FaDownload,
  FaFilePdf,
  FaFileImage,
  FaTimesCircle,
} from "react-icons/fa";

function DocumentItem({
  title,
  document,
}) {
  if (!document) {
    return (
      <div className="flex items-center justify-between border rounded-xl p-5 bg-red-50">

        <div className="flex items-center gap-4">

          <FaTimesCircle
            className="text-red-500 text-3xl"
          />

          <div>

            <h3 className="font-semibold">
              {title}
            </h3>

            <p className="text-red-500 text-sm">
              Not Uploaded
            </p>

          </div>

        </div>

      </div>
    );
  }

  const isPdf =
    document.file_name
      .toLowerCase()
      .endsWith(".pdf");

  const fileUrl =
    `http://localhost:5000/uploads/scholarship/${document.application_id}/${document.file_name}`;

  return (

    <div className="flex items-center justify-between border rounded-xl p-5">

      <div className="flex items-center gap-4">

        {isPdf ? (

          <FaFilePdf className="text-red-600 text-3xl" />

        ) : (

          <FaFileImage className="text-blue-600 text-3xl" />

        )}

        <div>

          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="text-sm text-gray-500">

            {document.file_name}

          </p>

        </div>

      </div>

      <div className="flex gap-3">

        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >

          <FaEye />

          View

        </a>

        <a
          href={fileUrl}
          download
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >

          <FaDownload />

          Download

        </a>

      </div>

    </div>

  );
}

export default DocumentItem;