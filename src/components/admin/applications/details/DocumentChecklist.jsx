import {
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function DocumentChecklist({

  documents,

}) {

  const checklist = [

    {
      label: "Student Photo",
      uploaded: !!documents.photo,
    },

    {
      label: "Aadhaar Card",
      uploaded: !!documents.aadhaar,
    },

    {
      label: "Previous Marks Memo",
      uploaded: !!documents.marksMemo,
    },

    {
      label: "Bank Passbook",
      uploaded: !!documents.passbook,
    },

  ];

  const uploadedCount =
    checklist.filter(
      (item) => item.uploaded
    ).length;

  const ready =
    uploadedCount === checklist.length;

  return (

    <div className="mt-8 rounded-xl border bg-gray-50 p-6">

      <h3 className="text-xl font-bold text-gray-800">

        Physical File Checklist

      </h3>

      <div className="mt-6 space-y-4">

        {checklist.map((item) => (

          <div
            key={item.label}
            className="flex items-center gap-3"
          >

            {item.uploaded ? (

              <FaCheckCircle className="text-green-600" />

            ) : (

              <FaTimesCircle className="text-red-600" />

            )}

            <span>

              {item.label}

            </span>

          </div>

        ))}

      </div>

      <div className="mt-8">

        {ready ? (

          <div className="rounded-lg bg-green-100 text-green-700 px-5 py-4 font-semibold">

            ✅ Print Ready

          </div>

        ) : (

          <div className="rounded-lg bg-yellow-100 text-yellow-700 px-5 py-4 font-semibold">

            ⚠ Some required documents are missing.

          </div>

        )}

      </div>

    </div>

  );

}

export default DocumentChecklist;