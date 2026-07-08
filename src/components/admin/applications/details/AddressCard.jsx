import SectionCard from "../SectionCard";

function AddressCard({ application }) {
  return (
    <SectionCard title="Address Details">

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">

        <InfoItem
          label="Full Address"
          value={application.address}
        />

        <InfoItem
          label="District"
          value={application.district}
        />

        <InfoItem
          label="State"
          value={application.state}
        />

        <InfoItem
          label="Pincode"
          value={application.pincode}
        />

      </div>

    </SectionCard>
  );
}

function InfoItem({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900 whitespace-pre-line">
        {value || "-"}
      </p>

    </div>
  );
}

export default AddressCard;