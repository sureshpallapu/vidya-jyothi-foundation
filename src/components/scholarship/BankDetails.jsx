import { useState } from "react";
import {
  FaUniversity,
  FaCodeBranch,
  FaSpinner,
} from "react-icons/fa";

import FormInput from "../common/FormInput";
import FormSection from "../common/FormSection";

import { getBankByIfsc } from "../../api/ifscApi";

function BankDetails({
  formData,
  setFormData,
  errors,
}) {

  const [fetchingBank, setFetchingBank] =
    useState(false);

  const [ifscError, setIfscError] =
    useState("");

  const handleChange = async (e) => {

    const { name, value } = e.target;

    let updatedValue = value;

    /*
    |--------------------------------------------------------------------------
    | Account Numbers
    |--------------------------------------------------------------------------
    */

    if (

      name === "accountNumber" ||

      name === "confirmAccountNumber"

    ) {

      updatedValue = value.replace(/\D/g, "");

    }

    /*
    |--------------------------------------------------------------------------
    | IFSC
    |--------------------------------------------------------------------------
    */

    if (name === "ifscCode") {

      updatedValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

    }

    setFormData((prev) => ({

      ...prev,

      [name]: updatedValue,

    }));

    /*
    |--------------------------------------------------------------------------
    | IFSC Lookup
    |--------------------------------------------------------------------------
    */

    if (

      name === "ifscCode" &&

      updatedValue.length === 11

    ) {

      try {

        setFetchingBank(true);

        setIfscError("");

        const response =
          await getBankByIfsc(
            updatedValue
          );

        setFormData((prev) => ({

          ...prev,

          ifscCode: updatedValue,

          bankName:
            response.data.bankName,

          branch:
            response.data.branch,

        }));

      }

      catch (error) {

        setIfscError(

          error.response?.data?.message ||

          "Invalid IFSC Code."

        );

        setFormData((prev) => ({

          ...prev,

          bankName: "",

          branch: "",

        }));

      }

      finally {

        setFetchingBank(false);

      }

    }

    else if (

      name === "ifscCode"

    ) {

      setIfscError("");

      setFormData((prev) => ({

        ...prev,

        bankName: "",

        branch: "",

      }));

    }

  };

  return (

    <FormSection title="Bank Details">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInput
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Enter Account Number"
          required
          error={errors.accountNumber}
        />

        <FormInput
          label="Confirm Account Number"
          name="confirmAccountNumber"
          value={formData.confirmAccountNumber}
          onChange={handleChange}
          placeholder="Re-enter Account Number"
          required
          error={errors.confirmAccountNumber}
        />

        <div>

          <FormInput
            label="IFSC Code"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            placeholder="SBIN0001234"
            maxLength={11}
            required
            error={errors.ifscCode}
          />

          {fetchingBank && (

            <p className="flex items-center gap-2 text-sm text-blue-600 mt-2">

              <FaSpinner className="animate-spin text-xs" />

              Looking up bank...

            </p>

          )}

          {ifscError && (

            <p className="text-red-500 text-sm mt-2">

              {ifscError}

            </p>

          )}

        </div>

        <div>

          <label className="flex items-center gap-2 mb-2 font-medium text-slate-700">

            <FaUniversity className="text-yellow-500 text-sm" />

            Bank Name

            <span className="text-red-500">*</span>

          </label>

          <input
            type="text"
            value={formData.bankName}
            readOnly
            placeholder="Auto-filled from IFSC"
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
          />

        </div>

        <div>

          <label className="flex items-center gap-2 mb-2 font-medium text-slate-700">

            <FaCodeBranch className="text-yellow-500 text-sm" />

            Branch

            <span className="text-red-500">*</span>

          </label>

          <input
            type="text"
            value={formData.branch || ""}
            readOnly
            placeholder="Auto-filled from IFSC"
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
          />

        </div>

      </div>

    </FormSection>

  );

}

export default BankDetails;