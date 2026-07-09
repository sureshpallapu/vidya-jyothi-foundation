import { useEffect, useState } from "react";

import {
  FaTimes,
  FaSave,
} from "react-icons/fa";

function CycleFormModal({

  open,

  onClose,

  onSave,

  cycle,

}) {

  const [form, setForm] = useState({

    scholarship_year: "",

    title: "",

    start_date: "",

    end_date: "",

    is_active: 0,

  });

  useEffect(() => {

    if (cycle) {

      setForm({

        scholarship_year:
          cycle.scholarship_year,

        title:
          cycle.title,

        start_date:
          cycle.start_date
            ?.substring(0,10),

        end_date:
          cycle.end_date
            ?.substring(0,10),

        is_active:
          cycle.is_active,

      });

    }

    else {

      setForm({

        scholarship_year: "",

        title: "",

        start_date: "",

        end_date: "",

        is_active: 0,

      });

    }

  }, [cycle]);

  const handleChange = (e) => {

    const { name, value, checked } =
      e.target;

    setForm((prev) => ({

      ...prev,

      [name]:

        name === "is_active"

          ? checked ? 1 : 0

          : value,

    }));

  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-6">

          <h2 className="text-2xl font-bold">

            {cycle

              ? "Edit Scholarship Cycle"

              : "Add Scholarship Cycle"}

          </h2>

          <button

            onClick={onClose}

            className="text-gray-500 hover:text-red-600"

          >

            <FaTimes />

          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="font-medium">

                Scholarship Year

              </label>

              <input

                type="number"

                name="scholarship_year"

                value={form.scholarship_year}

                onChange={handleChange}

                className="w-full border rounded-xl p-3 mt-2"

              />

            </div>

            <div>

              <label className="font-medium">

                Title

              </label>

              <input

                name="title"

                value={form.title}

                onChange={handleChange}

                className="w-full border rounded-xl p-3 mt-2"

              />

            </div>

            <div>

              <label className="font-medium">

                Start Date

              </label>

              <input

                type="date"

                name="start_date"

                value={form.start_date}

                onChange={handleChange}

                className="w-full border rounded-xl p-3 mt-2"

              />

            </div>

            <div>

              <label className="font-medium">

                End Date

              </label>

              <input

                type="date"

                name="end_date"

                value={form.end_date}

                onChange={handleChange}

                className="w-full border rounded-xl p-3 mt-2"

              />

            </div>

          </div>

          <label className="flex items-center gap-3">

            <input

              type="checkbox"

              name="is_active"

              checked={form.is_active === 1}

              onChange={handleChange}

            />

            Active Scholarship Cycle

          </label>

        </div>

        {/* Footer */}

        <div className="border-t p-6 flex justify-end gap-3">

          <button

            onClick={onClose}

            className="px-6 py-3 rounded-xl border"

          >

            Cancel

          </button>

          <button

            onClick={() => onSave(form)}

            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

          >

            <FaSave />

            Save

          </button>

        </div>

      </div>

    </div>

  );

}

export default CycleFormModal;