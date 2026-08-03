import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDonor } from "../../../api/donorApi";

function ViewDonor() {
  const { donorCode } = useParams();
  const navigate = useNavigate();

  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonor();
  }, []);

  const fetchDonor = async () => {
    try {
      const response = await getDonor(donorCode);
      setDonor(response?.data?.data || null);
    } catch (error) {
      console.error(error);
      navigate("/admin/donors");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading donor...
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="p-6 text-center text-red-500">
        Donor not found.
      </div>
    );
  }

  const Item = ({ label, value }) => (
    <div className="border-b py-3">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="font-medium">
        {value || "-"}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          View Donor
        </h1>

        <div className="flex gap-3">
          <Link
            to="/admin/donors"
            className="px-4 py-2 rounded bg-gray-200"
          >
            Back
          </Link>

          <Link
            to={`/admin/donors/${donor.donor_code}/edit`}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-6">

        <Item label="Donor Code" value={donor.donor_code} />
        <Item label="Donor Type" value={donor.donor_type} />

        <Item label="Full Name" value={donor.full_name} />
        <Item label="Display Name" value={donor.display_name} />

        <Item label="Mobile" value={donor.mobile} />
        <Item label="Alternate Mobile" value={donor.alternate_mobile} />

        <Item label="Email" value={donor.email} />
        <Item label="Website" value={donor.website} />

        <Item label="PAN Number" value={donor.pan_number} />
        <Item label="Aadhaar Number" value={donor.aadhaar_number} />

        <Item label="GST Number" value={donor.gst_number} />
        <Item
          label="Registration Number"
          value={donor.registration_number}
        />

        <Item label="Address Line 1" value={donor.address_line1} />
        <Item label="Address Line 2" value={donor.address_line2} />

        <Item label="City" value={donor.city} />
        <Item label="District" value={donor.district} />

        <Item label="State" value={donor.state} />
        <Item label="Country" value={donor.country} />

        <Item label="Pincode" value={donor.pincode} />
        <Item
          label="Preferred Communication"
          value={donor.preferred_communication}
        />

        <Item label="Status" value={donor.status} />
        <Item label="Remarks" value={donor.remarks} />

      </div>

    </div>
  );
}

export default ViewDonor;