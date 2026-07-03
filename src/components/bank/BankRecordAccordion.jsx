import { useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaFilePdf,
  FaDownload,
} from "react-icons/fa";

function BankRecordAccordion({ year, records }) {
  const [open, setOpen] = useState(year === 2026);

  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">

      {/* Header */}

      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          w-full
          items-center
          justify-between
          bg-slate-900
          px-8
          py-6
          text-white
          transition
          hover:bg-slate-800
        "
      >
        <div className="flex items-center gap-4">

          {open ? (
            <FaChevronDown className="text-yellow-400" />
          ) : (
            <FaChevronRight className="text-yellow-400" />
          )}

          <h2 className="text-2xl font-bold">
            {year} Bank Records
          </h2>

        </div>

        <span className="font-semibold text-yellow-400">
          {records.length} Files
        </span>

      </button>

      {/* Body */}

      {open && (

        <div className="p-8">

          {records.length === 0 ? (

            <div className="py-10 text-center">

              <p className="text-lg text-slate-500">
                No bank records available for {year}.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {records.map((record, index) => (

                <div
                  key={index}
                  className="
                    flex
                    flex-col
                    items-start
                    justify-between
                    gap-4
                    rounded-2xl
                    border
                    border-slate-200
                    p-5
                    transition-all
                    hover:bg-slate-50
                    md:flex-row
                    md:items-center
                  "
                >

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-red-100 p-3">

                      <FaFilePdf className="text-2xl text-red-600" />

                    </div>

                    <div>

                      <h3 className="text-lg font-semibold text-slate-900">
                        {record.month} Statement
                      </h3>

                      <p className="text-sm text-slate-500">
                        Monthly Bank Statement (PDF)
                      </p>

                    </div>

                  </div>

                  <a
                    href={record.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-yellow-500
                      px-5
                      py-3
                      font-semibold
                      text-slate-900
                      transition
                      hover:bg-yellow-600
                    "
                  >

                    <FaDownload />

                    Download PDF

                  </a>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default BankRecordAccordion;