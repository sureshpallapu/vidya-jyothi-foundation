import { format } from "date-fns";

function VerificationCard({ receipt }) {

    const formatAmount = (amount) => {

        return Number(amount).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
        });

    };

    return (

        <div className="mt-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Receipt Number */}

                <InfoItem
                    label="Receipt Number"
                    value={receipt.receipt_code}
                />

                {/* Donation Code */}

                <InfoItem
                    label="Donation Code"
                    value={receipt.donation_code}
                />

                {/* Receipt Date */}

                <InfoItem
                    label="Receipt Date"
                    value={
                        receipt.receipt_date
                            ? format(
                                  new Date(receipt.receipt_date),
                                  "dd MMM yyyy"
                              )
                            : "-"
                    }
                />

                {/* Status */}

                <InfoItem
                    label="Receipt Status"
                    value={
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                            {receipt.receipt_status}
                        </span>
                    }
                />

                {/* Donor */}

                <InfoItem
                    label="Donor Name"
                    value={receipt.full_name}
                />

                {/* Donation Type */}

                <InfoItem
                    label="Donation Type"
                    value={receipt.donation_type}
                />

                {/* Payment */}

                <InfoItem
                    label="Payment Mode"
                    value={receipt.payment_mode}
                />

                {/* Amount */}

                <InfoItem
                    label="Amount"
                    value={formatAmount(receipt.amount)}
                />

                {/* Mobile */}

                <InfoItem
                    label="Mobile"
                    value={receipt.mobile || "-"}
                />

                {/* Email */}

                <InfoItem
                    label="Email"
                    value={receipt.email || "-"}
                />

            </div>

            {/* Address */}

            <div className="mt-6">

                <h3 className="text-sm font-semibold text-gray-500 uppercase">

                    Address

                </h3>

                <p className="mt-2 text-gray-800">

                    {receipt.address || "-"}

                </p>

            </div>

            {/* Transaction Details */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                <InfoItem
                    label="Reference Number"
                    value={receipt.reference_number || "-"}
                />

                <InfoItem
                    label="Transaction ID"
                    value={receipt.transaction_id || "-"}
                />

            </div>

            {/* Footer */}

            <div className="mt-10 border-t pt-6 text-center">

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">

                    <span className="text-2xl">✅</span>

                    <span className="font-semibold text-green-700">

                        This is a genuine receipt issued by
                        <br />
                        Vidya Jyothi Foundation

                    </span>

                </div>

            </div>

        </div>

    );

}

function InfoItem({ label, value }) {

    return (

        <div>

            <p className="text-sm uppercase tracking-wide text-gray-500">

                {label}

            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900 break-words">

                {value}

            </p>

        </div>

    );

}

export default VerificationCard;