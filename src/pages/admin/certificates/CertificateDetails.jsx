import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CertificateViewCard from "./CertificateViewCard";

import {
    getCertificate,
    emailCertificate,
} from "../../../api/certificateApi";
import Swal from "sweetalert2";


function CertificateDetails() {

    const { certificateCode } = useParams();

    const [loading, setLoading] = useState(true);

    const [certificate, setCertificate] = useState(null);

    const [error, setError] = useState("");

    useEffect(() => {

        loadCertificate();

    }, [certificateCode]);

    const loadCertificate = async () => {

        try {

            setLoading(true);

            const response = await getCertificate(
                certificateCode
            );

            setCertificate(
                response.data.data
            );

        } catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Unable to load certificate."

            );

        } finally {

            setLoading(false);

        }

    };

   const handleDownload = async (certificate) => {

    window.open(

        `http://localhost:5000/api/fundraising/certificates/${certificate.id}/download`,

        "_blank"

    );

};



const handleEmail = async (certificate) => {

    try {

        Swal.fire({
            title: "Sending Certificate...",
            text: "Please wait",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const response = await emailCertificate(
            certificate.certificate_code
        );

        Swal.fire({
            icon: "success",
            title: "Email Sent",
            text:
                response.data.message ||
                "Certificate emailed successfully.",
        });

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Email Failed",
            text:
                error.response?.data?.message ||
                "Unable to send certificate email.",
        });

    }

};
    if (loading) {

        return (

            <div className="p-10 text-center">

                Loading Certificate...

            </div>

        );

    }

    if (error) {

        return (

            <div className="p-10 text-center text-red-600">

                {error}

            </div>

        );

    }

    return (

  <CertificateViewCard
    certificate={certificate}
    onDownload={handleDownload}
    onEmail={handleEmail}
    reload={loadCertificate}
/>

    );

}

export default CertificateDetails;