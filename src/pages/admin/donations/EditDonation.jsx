import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import DonationForm from "../../../components/admin/donations/DonationForm";

import {
    getDonation,
    updateDonation
} from "../../../api/donationApi";

export default function EditDonation() {

    const navigate = useNavigate();

    const { donationCode } = useParams();

    const [loading, setLoading] = useState(true);

    const [donation, setDonation] = useState(null);

    useEffect(() => {

        loadDonation();

    }, []);

    const loadDonation = async () => {

        try {

            setLoading(true);

            const response = await getDonation(donationCode);

            setDonation(response.data.data);

        } catch (error) {

            Swal.fire(
                "Error",
                "Unable to load donation.",
                "error"
            );

            navigate("/admin/donations");

        } finally {

            setLoading(false);

        }

    };

    const handleSubmit = async (formData) => {

        try {

            await updateDonation(
                donationCode,
                formData
            );

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Donation updated successfully."
            });

            navigate("/admin/donations");

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.message ||
                    "Unable to update donation."
            });

        }

    };

    if (loading || !donation) {
  return (
    <div className="flex justify-center py-20">
      Loading...
    </div>
  );
}

    return (

        <div className="p-6">

            <DonationForm

                editMode={true}

                initialValues={donation}

                onSubmit={handleSubmit}

            />

        </div>

    );

}