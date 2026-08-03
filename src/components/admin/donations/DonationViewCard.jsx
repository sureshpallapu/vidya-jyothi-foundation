import { useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaEdit,
    FaUser,
    FaMoneyBillWave,
    FaUniversity,
    FaCalendarAlt,
    FaStickyNote,
    FaReceipt,
    FaHistory
} from "react-icons/fa";

export default function DonationViewCard({ donation }) {

    const navigate = useNavigate();

    const formatAmount = (amount) => {
        if (!amount) return "₹0.00";

        return Number(amount).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        });
    };
const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

    const getStatusColor = (status) => {

        switch (status) {

            case "RECEIVED":
                return "bg-green-100 text-green-700";

            case "CLEARED":
                return "bg-blue-100 text-blue-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";

        }

    };

    const paymentMode =
        donation.payment_mode_name ||
        donation.payment_mode ||
        donation.mode_name ||
        "-";

    return (

        <div className="space-y-6">

            {/* HEADER */}

            <div className="bg-white rounded-xl shadow-lg p-6">

                <div className="flex justify-between items-center flex-wrap gap-4">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">

                            Donation Details

                        </h1>

                        <p className="text-gray-500 mt-2">

                            {donation.donation_code}

                        </p>

                    </div>

                    <div className="flex gap-3">

                        <button

                            onClick={() => navigate("/admin/donations")}

                            className="px-5 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"

                        >

                            <FaArrowLeft />

                            Back

                        </button>

                        <button

                            onClick={() =>
                                navigate(
                                    `/admin/donations/${donation.donation_code}/edit`
                                )
                            }

                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"

                        >

                            <FaEdit />

                            Edit

                        </button>

                    </div>

                </div>

                <div className="mt-5 flex gap-3 flex-wrap">

                    <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            donation.status
                        )}`}
                    >

                        {donation.status}

                    </span>

                    <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                            donation.is_archived
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                        }`}
                    >

                        {donation.is_archived
                            ? "Archived"
                            : "Active"}

                    </span>

                </div>

            </div>

            {/* DONATION INFORMATION */}

            <div className="bg-white rounded-xl shadow-lg">

                <div className="border-b px-6 py-4">

                    <h2 className="text-xl font-semibold flex items-center gap-2">

                        <FaMoneyBillWave />

                        Donation Information

                    </h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">

                    <InfoCard
                        icon={<FaUser />}
                        label="Donor Name"
                        value={donation.full_name}
                    />

                    <InfoCard
                        label="Donor Code"
                        value={donation.donor_code}
                    />

                    <InfoCard
                        label="Mobile"
                        value={donation.mobile}
                    />

                    <InfoCard
                        label="Email"
                        value={donation.email}
                    />

                    <InfoCard
                        label="Donation Type"
                        value={
                            donation.type_name ||
                            donation.donation_type
                        }
                    />

                    <InfoCard
                        icon={<FaUniversity />}
                        label="Payment Mode"
                        value={paymentMode}
                    />

                    <InfoCard
                        icon={<FaCalendarAlt />}
                        label="Donation Date"
                        value={formatDate(
                            donation.donation_date
                        )}
                    />

                    <InfoCard
                        label="Financial Year"
                        value={donation.financial_year}
                    />

                    <InfoCard
                        label="Currency"
                        value={donation.currency}
                    />

                    <InfoCard
                        label="Amount"
                        value={formatAmount(
                            donation.amount
                        )}
                    />

                    <InfoCard
                        label="Reference Number"
                        value={
                            donation.reference_number
                        }
                    />

                    <InfoCard
                        label="Status"
                        value={donation.status}
                    />

                </div>

            </div>
                        {/* PAYMENT DETAILS */}

            <div className="bg-white rounded-xl shadow-lg">

                <div className="border-b px-6 py-4">

                    <h2 className="text-xl font-semibold flex items-center gap-2">

                        <FaUniversity />

                        Payment Details

                    </h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">

                    <InfoCard
                        label="Cheque Number"
                        value={donation.cheque_number}
                    />

                    <InfoCard
                        label="Cheque Date"
                        value={formatDate(donation.cheque_date)}
                    />

                    <InfoCard
                        label="Bank Name"
                        value={donation.bank_name}
                    />

                    <InfoCard
                        label="Branch Name"
                        value={donation.branch_name}
                    />

                    <InfoCard
                        label="Transaction ID"
                        value={donation.transaction_id}
                    />

                    <InfoCard
                        label="UPI Reference"
                        value={donation.upi_reference}
                    />

                </div>

            </div>

            {/* RECEIPT & TAX */}

            <div className="bg-white rounded-xl shadow-lg">

                <div className="border-b px-6 py-4">

                    <h2 className="text-xl font-semibold flex items-center gap-2">

                        <FaReceipt />

                        Receipt & Tax Information

                    </h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-6">

                    <InfoCard
                        label="Receipt Required"
                        value={donation.receipt_required ? "Yes" : "No"}
                    />

                    <InfoCard
                        label="Receipt Generated"
                        value={donation.receipt_generated ? "Yes" : "No"}
                    />

                    <InfoCard
                        label="Tax Exemption"
                        value={donation.tax_exemption ? "Yes" : "No"}
                    />

                    <InfoCard
                        label="Anonymous Donation"
                        value={donation.is_anonymous ? "Yes" : "No"}
                    />

                </div>

            </div>

            {/* REMARKS */}

            <div className="bg-white rounded-xl shadow-lg">

                <div className="border-b px-6 py-4">

                    <h2 className="text-xl font-semibold flex items-center gap-2">

                        <FaStickyNote />

                        Remarks

                    </h2>

                </div>

                <div className="p-6">

                    <div className="border rounded-lg p-5 bg-gray-50 min-h-[120px] whitespace-pre-wrap">

                        {donation.remarks || "No remarks available."}

                    </div>

                </div>

            </div>

                        {/* AUDIT INFORMATION */}

            <div className="bg-white rounded-xl shadow-lg">

                <div className="border-b px-6 py-4">

                    <h2 className="text-xl font-semibold flex items-center gap-2">

                        <FaHistory />

                        Audit Information

                    </h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">

                    <InfoCard
                        label="Created By"
                        value={donation.created_by_name || donation.created_by}
                    />

                    <InfoCard
                        label="Created On"
                        value={formatDate(donation.created_at)}
                    />

                    <InfoCard
                        label="Updated By"
                        value={donation.updated_by_name || donation.updated_by}
                    />

                    <InfoCard
                        label="Updated On"
                        value={formatDate(donation.updated_at)}
                    />

                    <InfoCard
                        label="Archived"
                        value={donation.is_archived ? "Yes" : "No"}
                    />

                    <InfoCard
                        label="Receipt Generated"
                        value={donation.receipt_generated ? "Yes" : "No"}
                    />

                </div>

            </div>

            {/* ACTION BUTTONS */}

            <div className="bg-white rounded-xl shadow-lg p-6">

                <div className="flex flex-wrap gap-3 justify-end">

                    <button
                        onClick={() => navigate("/admin/donations")}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Back
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/admin/donations/${donation.donation_code}/edit`)
                        }
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Edit Donation
                    </button>

                    {!donation.is_archived && (
                        <button
                            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                            Archive
                        </button>
                    )}

                    {donation.is_archived && (
                        <button
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Restore
                        </button>
                    )}

                    {donation.status !== "CANCELLED" && (
                        <button
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Cancel Donation
                        </button>
                    )}

                </div>

            </div>

        </div>

    );

}

/*
|--------------------------------------------------------------------------
| Reusable Information Card
|--------------------------------------------------------------------------
*/

function InfoCard({ icon, label, value }) {

    return (

        <div className="border rounded-lg p-4 hover:shadow transition">

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                {icon}

                <span>{label}</span>

            </div>

            <div className="text-gray-800 font-semibold break-words">

                {value || "-"}

            </div>

        </div>

    );

}