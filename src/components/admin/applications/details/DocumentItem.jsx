import { useState } from "react";

import {
  FaEye,
  FaDownload,
  FaFilePdf,
  FaFileImage,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";

import DocumentViewerModal from "./DocumentViewerModal";

function DocumentItem({

  title,

  document,

}) {

  const [openViewer, setOpenViewer] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Not Uploaded
  |--------------------------------------------------------------------------
  */

  if (!document) {

    return (

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <FaTimesCircle className="text-red-500 text-3xl" />

          <div>

            <h3 className="font-semibold text-lg">

              {title}

            </h3>

            <p className="text-red-500 text-sm">

              Document Not Uploaded

            </p>

          </div>

        </div>

      </div>

    );

  }

  /*
  |--------------------------------------------------------------------------
  | File
  |--------------------------------------------------------------------------
  */

  const fileUrl =
    `http://localhost:5000/uploads/scholarship/${document.application_id}/${document.file_name}`;

  const isPdf =
    document.file_name
      .toLowerCase()
      .endsWith(".pdf");

  return (

    <>

      <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* Left */}

          <div className="flex items-center gap-5">

            <div>

              {isPdf ? (

                <FaFilePdf className="text-red-600 text-5xl" />

              ) : (

                <FaFileImage className="text-blue-600 text-5xl" />

              )}

            </div>

            <div>

              <h3 className="font-bold text-lg">

                {title}

              </h3>

              <p className="text-gray-500 break-all">

                {document.file_name}

              </p>

              <div className="flex items-center gap-2 mt-2 text-green-600">

                <FaCheckCircle />

                Uploaded Successfully

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="flex gap-3">

            <button
              onClick={() =>
                setOpenViewer(true)
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >

              <FaEye />

              View

            </button>

           <a
  href={`http://localhost:5000/api/scholarship/documents/download/${document.application_id}/${document.file_name}`}
  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
>
  <FaDownload />
  Download
</a>
          </div>

        </div>

      </div>

      {/* Viewer */}

      <DocumentViewerModal

        open={openViewer}

        onClose={() =>
          setOpenViewer(false)
        }

        title={title}

        fileUrl={fileUrl}

      />

    </>

  );

}

export default DocumentItem;