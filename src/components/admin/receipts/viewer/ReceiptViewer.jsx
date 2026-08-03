import ReceiptPrintTemplate from "../ReceiptPrintTemplate";

export default function ReceiptViewer({ receipt }) {

    if (!receipt) return null;

    return (

        <div className="receipt-viewer">

            {/* ================= HEADER ================= */}

            <div className="no-print bg-white rounded-t-xl border border-gray-200 px-6 py-5 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-slate-800">

                            Donation Receipt Preview

                        </h2>

                        <p className="text-gray-500 mt-1">

                            This is the official receipt that will be
                            printed, downloaded and emailed.

                        </p>

                    </div>

                    <span
                        className={`
                            px-4 py-2 rounded-full font-semibold
                            ${
                                receipt.receipt_status === "GENERATED"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }
                        `}
                    >

                        {receipt.receipt_status}

                    </span>

                </div>

            </div>

            {/* ================= PAPER ================= */}

            <div className="receipt-print-area bg-slate-200 border-x border-b rounded-b-xl py-10">

                <div
                    id="receipt-print"
                    className="
                        mx-auto
                        bg-white
                        shadow-2xl
                        w-[794px]
                    "
                >

                    <ReceiptPrintTemplate
                        receipt={receipt}
                    />

                </div>

            </div>

        </div>

    );

}