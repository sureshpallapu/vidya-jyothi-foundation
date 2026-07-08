import SectionCard from "../SectionCard";

function BankCard({ application }) {
  return (
    <SectionCard title="Bank Details">

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">

        <InfoItem
          label="Bank Name"
          value={application.bank_name}
        />

        <InfoItem
          label="Account Number"
          value={application.account_number}
        />

        <InfoItem
          label="IFSC Code"
          value={application.ifsc_code}
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

      <p className="mt-1 font-semibold text-gray-900">
        {value || "-"}
      </p>

    </div>
  );
}

export default BankCard;