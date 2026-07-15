import {
  FaUniversity,
  FaCreditCard,
  FaLandmark,
} from "react-icons/fa";

import SectionCard from "../SectionCard";

function BankCard({ application }) {

  const maskAccountNumber = (account) => {

    if (!account) return "-";

    if (account.length <= 4) return account;

    return `XXXXXX${account.slice(-4)}`;

  };

  return (

    <SectionCard title="Bank Information">

      <div className="grid md:grid-cols-3 gap-8">

        <InfoItem
          icon={<FaUniversity className="text-blue-600" />}
          label="Bank Name"
          value={application.bank_name}
        />

        <InfoItem
          icon={<FaCreditCard className="text-green-600" />}
          label="Account Number"
          value={maskAccountNumber(
            application.account_number
          )}
        />

        <InfoItem
          icon={<FaLandmark className="text-purple-600" />}
          label="IFSC Code"
          value={application.ifsc_code}
        />

      </div>

    </SectionCard>

  );

}

function InfoItem({

  icon,

  label,

  value,

}) {

  return (

    <div className="flex items-start gap-4">

      <div className="mt-1 text-xl">

        {icon}

      </div>

      <div>

        <p className="text-sm text-gray-500">

          {label}

        </p>

        <p className="mt-1 font-semibold text-gray-900 break-all">

          {value || "-"}

        </p>

      </div>

    </div>

  );

}

export default BankCard;