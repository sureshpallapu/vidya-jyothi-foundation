import { useState } from "react";

import {
    FaAward,
    FaHandshake,
    FaBuilding,
    FaTimes,
    FaCheckCircle,
} from "react-icons/fa";

export default function GenerateCertificateModal({

    open,

    onClose,

    donation,

    onGenerate,

}) {

    const [certificateType, setCertificateType] =
        useState("");

    const [remarks, setRemarks] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    if (!open) return null;

    const certificateTypes = [

        {

            value: "APPRECIATION",

            title: "Certificate of Appreciation",

            description:
                "Recognize and appreciate an individual donor for their valuable contribution.",

            icon: <FaAward className="text-4xl text-yellow-500" />,

        },

        {

            value: "SPONSOR",

            title: "Sponsor Certificate",

            description:
                "Recognize sponsorship support for educational initiatives.",

            icon: <FaHandshake className="text-4xl text-blue-600" />,

        },

        {

            value: "CSR",

            title: "CSR Certificate",

            description:
                "Corporate Social Responsibility contribution certificate.",

            icon: <FaBuilding className="text-4xl text-green-600" />,

        },

    ];

    const handleGenerate = async () => {

        if (!certificateType) {

            return;

        }

        try {

            setLoading(true);

            await onGenerate({

                donation,

                certificate_type:
                    certificateType,

                remarks,

            });

        } finally {

            setLoading(false);

        }

    };

        return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* ================= Header ================= */}

                <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-blue-700 to-blue-600">

                    <div>

                        <h2 className="text-2xl font-bold text-white">

                            Generate Donation Certificate

                        </h2>

                        <p className="text-blue-100 mt-1">

                            Select the certificate type and generate an official certificate.

                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-200 transition"
                    >

                        <FaTimes size={24} />

                    </button>

                </div>

                {/* ================= Body ================= */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">

                    {/* ================= Left ================= */}

                    <div className="lg:col-span-2">

                        <h3 className="text-lg font-semibold text-gray-800 mb-5">

                            Certificate Type

                        </h3>

                        <div className="space-y-5">

                            {

                                certificateTypes.map((item) => (

                                    <div

                                        key={item.value}

                                        onClick={() =>
                                            setCertificateType(item.value)
                                        }

                                        className={`
                                            cursor-pointer
                                            rounded-xl
                                            border-2
                                            p-5
                                            transition-all
                                            duration-300
                                            hover:shadow-lg

                                            ${
                                                certificateType === item.value
                                                    ? "border-blue-600 bg-blue-50"
                                                    : "border-gray-200 bg-white"
                                            }
                                        `}
                                    >

                                        <div className="flex items-start justify-between">

                                            <div className="flex gap-5">

                                                <div>

                                                    {item.icon}

                                                </div>

                                                <div>

                                                    <h4 className="font-bold text-lg text-gray-900">

                                                        {item.title}

                                                    </h4>

                                                    <p className="mt-2 text-gray-600">

                                                        {item.description}

                                                    </p>

                                                </div>

                                            </div>

                                            {

                                                certificateType === item.value && (

                                                    <FaCheckCircle
                                                        className="text-blue-600 text-2xl"
                                                    />

                                                )

                                            }

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                        {/* ================= Remarks ================= */}

                        <div className="mt-8">

                            <label className="block mb-2 font-semibold text-gray-700">

                                Remarks

                                <span className="text-gray-400 ml-2">

                                    (Optional)

                                </span>

                            </label>

                            <textarea

                                rows={4}

                                value={remarks}

                                onChange={(e) =>
                                    setRemarks(e.target.value)
                                }

                                placeholder="Enter remarks..."

                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    p-3
                                    focus:ring-2
                                    focus:ring-blue-500
                                    outline-none
                                "

                            />

                        </div>

                    </div>

                                        {/* ================= Right Side Preview ================= */}

                    <div>

                        <div className="sticky top-5 rounded-2xl border border-gray-200 bg-gray-50 p-6">

                            <h3 className="text-lg font-bold text-gray-800">

                                Certificate Preview

                            </h3>

                            <p className="text-sm text-gray-500 mt-1">

                                Preview of the selected certificate type.

                            </p>

                            <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

                                <div className="text-center">

                                    <div className="text-5xl mb-4">

                                        {

                                            certificateType === "APPRECIATION"

                                                ? "🏅"

                                                : certificateType === "SPONSOR"

                                                ? "🤝"

                                                : certificateType === "CSR"

                                                ? "🏢"

                                                : "📜"

                                        }

                                    </div>

                                    <h4 className="text-xl font-bold text-blue-700">

                                        {

                                            certificateType === "APPRECIATION"

                                                ? "Certificate of Appreciation"

                                                : certificateType === "SPONSOR"

                                                ? "Sponsor Certificate"

                                                : certificateType === "CSR"

                                                ? "CSR Contribution Certificate"

                                                : "Select Certificate Type"

                                        }

                                    </h4>

                                    <p className="mt-4 text-sm text-gray-600">

                                        Presented To

                                    </p>

                                    <p className="mt-2 text-xl font-bold text-gray-900">

                                        {

                                            donation?.full_name ||

                                            donation?.donor_name ||

                                            "Donor Name"

                                        }

                                    </p>

                                    <div className="mt-6 border-t pt-4">

                                        <div className="flex justify-between text-sm">

                                            <span className="text-gray-500">

                                                Donation Amount

                                            </span>

                                            <span className="font-semibold">

                                                ₹

                                                {

                                                    Number(

                                                        donation?.amount || 0

                                                    ).toLocaleString("en-IN")

                                                }

                                            </span>

                                        </div>

                                        <div className="flex justify-between mt-2 text-sm">

                                            <span className="text-gray-500">

                                                Donation Type

                                            </span>

                                            <span className="font-semibold">

                                                {

                                                    donation?.donation_type ||

                                                    "-"

                                                }

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {

                                !certificateType && (

                                    <div className="mt-5 rounded-lg border border-yellow-300 bg-yellow-50 p-3">

                                        <p className="text-sm text-yellow-700">

                                            Please select a certificate type to continue.

                                        </p>

                                    </div>

                                )

                            }

                        </div>

                    </div>

                </div>

                {/* ================= Footer ================= */}

                <div className="flex items-center justify-between border-t bg-gray-50 px-8 py-5">

                    <button

                        onClick={onClose}

                        disabled={loading}

                        className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-100 transition"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={handleGenerate}

                        disabled={!certificateType || loading}

                        className="rounded-lg bg-blue-600 px-8 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"

                    >

                        {

                            loading

                                ? "Generating..."

                                : "Generate Certificate"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}