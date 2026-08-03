import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { verifyReceipt } from "../../api/receiptApi";

import VerificationHeader from "../../components/admin/receipts/VerificationHeader";
import VerificationStatus from "../../components/admin/receipts/VerificationStatus";
import VerificationCard from "../../components/admin/receipts/VerificationCard";

export default function ReceiptVerification() {

    const { receiptCode } = useParams();

    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {

        if (receiptCode) {
            fetchReceiptVerification();
        }

    }, [receiptCode]);

    /*
    |--------------------------------------------------------------------------
    | Verify Receipt
    |--------------------------------------------------------------------------
    */

    const fetchReceiptVerification = async () => {

        try {

            setLoading(true);

            const response = await verifyReceipt(receiptCode);

            setReceipt(response.data.data);

            setVerified(response.data.success);

            setMessage(response.data.message);

        } catch (error) {

            console.error("Receipt Verification Error:", error);

            setVerified(false);

            setReceipt(null);

            setMessage(
                error.response?.data?.message ||
                "Unable to verify this receipt."
            );

        } finally {

            setLoading(false);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Loading Screen
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-100 flex items-center justify-center">

                <div className="bg-white shadow-xl rounded-2xl p-10 text-center w-full max-w-md">

                    <div className="w-14 h-14 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                    <h2 className="mt-6 text-xl font-semibold text-slate-800">

                        Verifying Donation Receipt

                    </h2>

                    <p className="mt-2 text-gray-500">

                        Please wait while we verify the authenticity of the receipt.

                    </p>

                </div>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <div className="min-h-screen bg-slate-100 py-12">

            <div className="max-w-5xl mx-auto px-4">

                {/* Header */}

                <VerificationHeader />

                {/* Verification Card */}

                <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Status Banner */}

                    <div className="px-8 pt-8">

                        <VerificationStatus success={verified} />

                    </div>

                    {/* Receipt Information */}

                    <div className="px-8 pb-8">

                        {verified && receipt ? (

                            <VerificationCard
                                receipt={receipt}
                            />

                        ) : (

                            <div className="py-16 text-center">

                                <div className="text-6xl mb-4">

                                    ❌

                                </div>

                                <h2 className="text-2xl font-bold text-red-600">

                                    Verification Failed

                                </h2>

                                <p className="mt-3 text-gray-600">

                                    {message}

                                </p>

                            </div>

                        )}

                    </div>

                </div>

                
            </div>

        </div>

    );

}