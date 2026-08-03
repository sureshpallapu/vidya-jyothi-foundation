// import logo from "../../../assets/logo.png";

import { toWords } from "number-to-words";
import QRCode from "react-qr-code";

export default function ReceiptPrintTemplate({ receipt }) {

    /* ==========================================================
       Helpers
    ========================================================== */

    const verificationUrl =
        `${window.location.origin}/verify/${receipt.receipt_code}`;

    const formatCurrency = (amount) =>

        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(Number(amount || 0));

    const formatDate = (date) =>

        new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    const amountInWords = (amount) => {

        const value = Number(amount || 0);

        if (value === 0) {
            return "Zero Rupees Only";
        }

        return (
            toWords(Math.floor(value))
                .replace(/\b\w/g, (char) => char.toUpperCase()) +
            " Rupees Only"
        );

    };

    return (

        <div
            id="receipt-print"
            className="
                mx-auto
                bg-white
                text-gray-900
                w-[794px]
                min-h-[1123px]
                p-10
                shadow-none
                print:w-full
                print:min-h-0
                print:p-8
            "
        >

            {/* ==========================================================
               HEADER
            ========================================================== */}

            <div className="border-b-2 border-slate-700 pb-6">

                <div className="flex justify-between items-start">

                    {/* Left */}

                    <div className="flex gap-5">

                        {/*

                        <img
                            src={logo}
                            alt="Trust Logo"
                            className="w-20 h-20 object-contain"
                        />

                        */}

                        <div>

                            <h1 className="text-3xl font-bold text-blue-900 tracking-wide">

                                VIDYA JYOTHI FOUNDATION

                            </h1>

                            <p className="mt-2">
                                Guntur, Andhra Pradesh
                            </p>

                            <p>
                                support@vidyajyothifoundation.org
                            </p>

                            <p>
                                +91 XXXXX XXXXX
                            </p>

                            <p className="mt-2 text-xs text-gray-600">

                                Reg. No :
                                ____________________

                                <span className="mx-3">|</span>

                                PAN :
                                ____________________

                            </p>

                        </div>

                    </div>

                    {/* Right */}

                    <div className="w-72">

                        <h2 className="text-2xl font-bold text-right">

                            DONATION RECEIPT

                        </h2>

                        <table className="w-full mt-5 text-sm">

                            <tbody>

                                <tr>

                                    <td className="py-1 font-semibold">

                                        Receipt No

                                    </td>

                                    <td className="text-right">

                                        {receipt.receipt_code}

                                    </td>

                                </tr>

                                <tr>

                                    <td className="py-1 font-semibold">

                                        Receipt Date

                                    </td>

                                    <td className="text-right">

                                        {formatDate(
                                            receipt.receipt_date
                                        )}

                                    </td>

                                </tr>

                                <tr>

                                    <td className="py-1 font-semibold">

                                        Status

                                    </td>

                                    <td className="text-right font-semibold text-green-700">

                                        {
                                            receipt.receipt_status ||
                                            receipt.status
                                        }

                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* ==========================================================
               DONOR INFORMATION
            ========================================================== */}

            <div className="mt-8">

                <div className="bg-slate-700 text-white px-4 py-2 rounded-t">

                    <h3 className="font-bold tracking-wide uppercase">

                        Donor Information

                    </h3>

                </div>

                <table className="w-full border border-collapse text-sm">

                    <tbody>

                        <tr>

                            <td className="w-44 border bg-slate-50 px-4 py-3 font-semibold">
                                Donor Name
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.donor_name || "-"}
                            </td>

                            <td className="w-40 border bg-slate-50 px-4 py-3 font-semibold">
                                Mobile
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.mobile || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="border bg-slate-50 px-4 py-3 font-semibold">
                                Email
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.email || "-"}
                            </td>

                            <td className="border bg-slate-50 px-4 py-3 font-semibold">
                                Payment Mode
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.payment_mode || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="border bg-slate-50 px-4 py-3 font-semibold">
                                Address
                            </td>

                            <td
                                className="border px-4 py-3"
                                colSpan={3}
                            >
                                {receipt.address || "-"}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

            {/* ==========================================================
               DONATION INFORMATION
            ========================================================== */}

            <div className="mt-8">

                <div className="bg-slate-700 text-white px-4 py-2 rounded-t">

                    <h3 className="font-bold tracking-wide uppercase">

                        Donation Information

                    </h3>

                </div>

                <table className="w-full border border-collapse text-sm">

                    <tbody>

                        <tr>

                            <td className="w-44 border bg-slate-50 px-4 py-3 font-semibold">
                                Donation Type
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.donation_type || "General Donation"}
                            </td>

                            <td className="w-40 border bg-slate-50 px-4 py-3 font-semibold">
                                Receipt Type
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.receipt_type || "ORIGINAL"}
                            </td>

                        </tr>

                        <tr>

                            <td className="border bg-slate-50 px-4 py-3 font-semibold">
                                Donation Purpose
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.donation_purpose || "-"}
                            </td>

                            <td className="border bg-slate-50 px-4 py-3 font-semibold">
                                Payment Mode
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.payment_mode || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="border bg-slate-50 px-4 py-3 font-semibold">
                                Reference No
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.reference_number || "-"}
                            </td>

                            <td className="border bg-slate-50 px-4 py-3 font-semibold">
                                Transaction ID
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.transaction_id || "-"}
                            </td>

                        </tr>

                        <tr>

                            <td className="border bg-slate-50 px-4 py-3 font-semibold">
                                Donation Date
                            </td>

                            <td className="border px-4 py-3">
                                {formatDate(
                                    receipt.donation_date ||
                                    receipt.receipt_date
                                )}
                            </td>

                            <td className="border bg-slate-50 px-4 py-3 font-semibold">
                                Financial Year
                            </td>

                            <td className="border px-4 py-3">
                                {receipt.financial_year || "-"}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

            {/* ==========================================================
               DONATION SUMMARY
            ========================================================== */}

            <div className="mt-8">

                <div className="bg-slate-700 text-white px-4 py-2 rounded-t">

                    <h3 className="font-bold tracking-wide uppercase">

                        Donation Summary

                    </h3>

                </div>

                <div className="border border-t-0 p-6">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-600 text-sm">

                                Total Donation Amount

                            </p>

                            <h2 className="text-3xl font-bold text-green-700 mt-1">

                                {formatCurrency(receipt.amount)}

                            </h2>

                        </div>

                        <div className="text-right">

                            <p className="text-gray-600 text-sm">

                                Tax Exemption

                            </p>

                            <span
                                className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
                                    receipt.tax_exemption
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >

                                {receipt.tax_exemption
                                    ? "Eligible"
                                    : "Not Applicable"}

                            </span>

                        </div>

                    </div>

                    <div className="mt-6 border rounded-lg bg-slate-50 p-4">

                        <p className="text-sm font-semibold text-gray-600 uppercase">

                            Amount in Words

                        </p>

                        <p className="mt-2 text-base font-medium leading-7 text-slate-800">

                            {amountInWords(receipt.amount)}

                        </p>

                    </div>

                </div>

            </div>

            {/* ==========================================================
               DECLARATION
            ========================================================== */}

            <div className="mt-8 border rounded-lg overflow-hidden">

                <div className="bg-slate-700 text-white px-4 py-2">

                    <h3 className="font-bold uppercase tracking-wide">

                        Declaration

                    </h3>

                </div>

                <div className="p-5">

                    <p className="leading-7 text-justify text-gray-700">

                        Received with sincere thanks from

                        <span className="font-semibold">

                            {" "}{receipt.donor_name}

                        </span>

                        {" "}towards the charitable and educational
                        activities of

                        <span className="font-semibold">

                            {" "}Vidya Jyothi Foundation.

                        </span>

                        This receipt has been generated electronically
                        and is valid without a physical signature.

                    </p>

                </div>

            </div>

            {/* ==========================================================
               FOOTER
            ========================================================== */}

            <div className="mt-10">

                <div className="grid grid-cols-2 gap-10">

                    {/* QR */}

                    <div>

                        <div className="border rounded-lg p-5 inline-block">

                            <QRCode
                                value={verificationUrl}
                                size={110}
                            />

                        </div>

                        <p className="mt-3 font-semibold">

                            Scan to Verify Receipt

                        </p>

                        <p className="text-xs text-gray-500 mt-1">

                            {receipt.receipt_code}

                        </p>

                        <p className="text-xs text-gray-500">

                            Verify the authenticity of this receipt
                            using the QR code.

                        </p>

                    </div>

                    {/* Signature */}

                    <div className="text-right">

                        <div className="h-20"></div>

                        <div className="border-t border-gray-700 w-64 ml-auto"></div>

                        <p className="mt-2 font-semibold">

                            Authorized Signatory

                        </p>

                        <p className="text-sm">

                            Vidya Jyothi Foundation

                        </p>

                        <p className="text-xs text-gray-500 mt-2">

                            This is a computer-generated receipt.

                        </p>

                    </div>

                </div>

            </div>

            {/* ==========================================================
               BOTTOM FOOTER
            ========================================================== */}

            <div className="mt-10 border-t pt-4 text-center text-xs text-gray-500">

                <p>

                    Vidya Jyothi Foundation

                </p>

                <p>

                    Guntur, Andhra Pradesh

                </p>

                <p>

                    support@vidyajyothifoundation.org

                    {" | "}

                    +91 XXXXX XXXXX

                </p>

                <p className="mt-2">

                    Generated On :
                    {" "}
                    {new Date().toLocaleString("en-IN")}

                </p>

            </div>

        </div>

    );

}