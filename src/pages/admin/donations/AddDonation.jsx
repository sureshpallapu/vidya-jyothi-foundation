import { useNavigate } from "react-router-dom";
import DonationForm from "../../../components/admin/donations/DonationForm";

export default function AddDonation() {

    const navigate = useNavigate();

    return (

        <div className="p-6">

            <DonationForm
                mode="create"
                onSuccess={() => navigate("/admin/donations")}
                onCancel={() => navigate("/admin/donations")}
            />

        </div>

    );

}