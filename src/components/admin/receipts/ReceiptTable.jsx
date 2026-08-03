import ReceiptActionMenu from "./ReceiptActionMenu";
import ReceiptLoading from "./ReceiptLoading";
import ReceiptEmptyState from "./ReceiptEmptyState";

export default function ReceiptTable({

    receipts = [],

    loading = false,

    onView,

    onPrint,

    onPDF,

    onArchive,

    onCancel,

    onRestore,

}) {

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount || 0);

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("en-IN") : "-";

    const StatusBadge = ({ status }) => {

        const styles = {
            GENERATED: "bg-green-100 text-green-700",
            CANCELLED: "bg-red-100 text-red-700",
            ARCHIVED: "bg-gray-100 text-gray-700",
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    styles[status] || "bg-gray-100 text-gray-700"
                }`}
            >
                {status}
            </span>
        );
    };

    const TypeBadge = ({ type }) => {

        const styles = {
            ORIGINAL: "bg-blue-100 text-blue-700",
            DUPLICATE: "bg-yellow-100 text-yellow-700",
            REPRINT: "bg-purple-100 text-purple-700",
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    styles[type] || "bg-gray-100 text-gray-700"
                }`}
            >
                {type}
            </span>
        );
    };

    if (loading) {
        return <ReceiptLoading />;
    }

    if (!receipts.length) {
        return <ReceiptEmptyState />;
    }

    return (

        <div className="bg-white rounded-xl shadow border overflow-hidden">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-slate-50 uppercase text-xs tracking-wider">

                        <tr>

                            <th className="px-4 py-3 text-left">Receipt</th>

                            <th className="px-4 py-3 text-left">Donation</th>

                            <th className="px-4 py-3 text-left">Donor</th>

                            <th className="px-4 py-3 text-right">Amount</th>

                            <th className="px-4 py-3 text-center">Date</th>

                            <th className="px-4 py-3 text-center">Status</th>

                            <th className="px-4 py-3 text-center">Type</th>

                            <th className="px-4 py-3 text-center">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {receipts.map((receipt) => (

                            <tr
                                key={receipt.receipt_code}
                                className="border-t hover:bg-gray-50 transition"
                            >

                                <td className="px-4 py-4 font-semibold">
                                    {receipt.receipt_code}
                                </td>

                                <td className="px-4 py-4">
                                    {receipt.donation_code}
                                </td>

                                <td className="px-4 py-4">

                                    <div>

                                        <div className="font-medium">
                                            {receipt.donor_name}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {receipt.mobile_number}
                                        </div>

                                    </div>

                                </td>

                                <td className="px-4 py-4 text-right font-semibold">
                                    {formatCurrency(receipt.amount)}
                                </td>

                                <td className="px-4 py-4 text-center">
                                    {formatDate(receipt.receipt_date)}
                                </td>

                                <td className="px-4 py-4 text-center">
                                    <StatusBadge
                                        status={receipt.receipt_status}
                                    />
                                </td>

                                <td className="px-4 py-4 text-center">
                                    <TypeBadge
                                        type={receipt.receipt_type}
                                    />
                                </td>

                                <td className="px-4 py-4 text-center">

                                    <ReceiptActionMenu
                                        receipt={receipt}
                                        onView={onView}
                                        onPrint={onPrint}
                                        onPDF={onPDF}
                                        onCancel={onCancel}
                                        onArchive={onArchive}
                                        onRestore={onRestore}
                                    />

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}