import { Menu } from "@headlessui/react";

import {
  FaEllipsisV,
  FaEye,
  FaPrint,
  FaFilePdf,
  FaBan,
  FaArchive,
  FaUndo,
} from "react-icons/fa";

export default function ReceiptActionMenu({

  receipt,

  onView,

  onPrint,

  onPDF,

  onCancel,

  onArchive,

  onRestore,

}) {

  return (

    <Menu as="div" className="relative inline-block">

      <Menu.Button
        className="p-2 rounded-lg hover:bg-gray-100"
      >

        <FaEllipsisV />

      </Menu.Button>

      <Menu.Items
        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border z-50"
      >

        <Menu.Item>

          {({ active }) => (

            <button
              onClick={() => onView(receipt)}
              className={`w-full px-4 py-3 flex items-center gap-3 ${
                active ? "bg-gray-100" : ""
              }`}
            >

              <FaEye />

              View Receipt

            </button>

          )}

        </Menu.Item>

        <Menu.Item>

          {({ active }) => (

            <button
              onClick={() => onPrint(receipt)}
              className={`w-full px-4 py-3 flex items-center gap-3 ${
                active ? "bg-gray-100" : ""
              }`}
            >

              <FaPrint />

              Print Receipt

            </button>

          )}

        </Menu.Item>

        <Menu.Item>

          {({ active }) => (

            <button
              onClick={() => onPDF(receipt)}
              className={`w-full px-4 py-3 flex items-center gap-3 ${
                active ? "bg-gray-100" : ""
              }`}
            >

              <FaFilePdf />

              Download PDF

            </button>

          )}

        </Menu.Item>

        {receipt.receipt_status === "GENERATED" && (

          <Menu.Item>

            {({ active }) => (

              <button
                onClick={() => onCancel(receipt)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-orange-600 ${
                  active ? "bg-orange-50" : ""
                }`}
              >

                <FaBan />

                Cancel Receipt

              </button>

            )}

          </Menu.Item>

        )}

        {!receipt.is_archived ? (

          <Menu.Item>

            {({ active }) => (

              <button
                onClick={() => onArchive(receipt)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-red-600 ${
                  active ? "bg-red-50" : ""
                }`}
              >

                <FaArchive />

                Archive Receipt

              </button>

            )}

          </Menu.Item>

        ) : (

          <Menu.Item>

            {({ active }) => (

              <button
                onClick={() => onRestore(receipt)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-green-600 ${
                  active ? "bg-green-50" : ""
                }`}
              >

                <FaUndo />

                Restore Receipt

              </button>

            )}

          </Menu.Item>

        )}

      </Menu.Items>

    </Menu>

  );

}