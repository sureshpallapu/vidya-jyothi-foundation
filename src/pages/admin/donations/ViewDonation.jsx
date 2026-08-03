import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { getDonation } from "../../../api/donationApi";
import DonationViewCard from "../../../components/admin/donations/DonationViewCard";

export default function ViewDonation() {

    const navigate = useNavigate();

    const { donationCode } = useParams();

    const [loading, setLoading] = useState(true);

    const [donation, setDonation] = useState(null);

    useEffect(() => {

        loadDonation();

    }, [donationCode]);

    const loadDonation = async () => {

        try {

            setLoading(true);

            const response = await getDonation(donationCode);

            setDonation(response.data.data);

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.message ||
                    "Unable to load donation.",
            });

            navigate("/admin/donations");

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="flex justify-center py-20">

                <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-indigo-600" />

            </div>

        );

    }

    if (!donation) return null;

    return (

        <div className="p-6">

            <DonationViewCard donation={donation} />

        </div>

    );

}