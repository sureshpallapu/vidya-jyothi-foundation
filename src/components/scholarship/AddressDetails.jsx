import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaFlag,
  FaSpinner,
} from "react-icons/fa";

import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";
import FormSection from "../common/FormSection";

import { getLocationByPincode } from "../../api/pincodeApi";

const DEFAULT_STATE = "Andhra Pradesh";

function AddressDetails({
  formData,
  setFormData,
  errors,
}) {
  const [fetchingLocation, setFetchingLocation] =
    useState(false);

  const [pincodeError, setPincodeError] =
    useState("");

  const handleChange = async (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    /*
    |--------------------------------------------------------------------------
    | PIN Code
    |--------------------------------------------------------------------------
    */

    if (name === "pincode") {

      updatedValue = value.replace(/\D/g, "");

    }

    setFormData((prev) => ({

      ...prev,

      [name]: updatedValue,

    }));

    /*
    |--------------------------------------------------------------------------
    | PIN Code Lookup
    |--------------------------------------------------------------------------
    */

    if (

      name === "pincode" &&

      updatedValue.length === 6

    ) {

      try {

        setFetchingLocation(true);

        setPincodeError("");

        const response =
          await getLocationByPincode(
            updatedValue
          );

        /*
        |--------------------------------------------------------------------------
        | Andhra Pradesh Validation
        |--------------------------------------------------------------------------
        */

        if (

          response.data.state !==
          DEFAULT_STATE

        ) {

          setPincodeError(

            "Currently scholarship applications are accepted only from Andhra Pradesh."

          );

          setFormData((prev) => ({

            ...prev,

            district: "",

            state: "",

          }));

          return;

        }

        /*
        |--------------------------------------------------------------------------
        | Auto Fill
        |--------------------------------------------------------------------------
        */

        setFormData((prev) => ({

          ...prev,

          pincode: updatedValue,

          district:
            response.data.district,

          state:
            response.data.state,

        }));

      }

      catch (error) {

        setPincodeError(

          error.response?.data?.message ||

          "Invalid PIN Code."

        );

        setFormData((prev) => ({

          ...prev,

          district: "",

          state: "",

        }));

      }

      finally {

        setFetchingLocation(false);

      }

    }

    /*
    |--------------------------------------------------------------------------
    | User Editing PIN Code
    |--------------------------------------------------------------------------
    */

    else if (name === "pincode") {

      setPincodeError("");

      setFormData((prev) => ({

        ...prev,

        district: "",

        state: "",

      }));

    }

  };

  return (

    <FormSection title="Address Details">

      <div className="grid grid-cols-1 gap-6">

        <FormTextarea
          label="Complete Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="House No., Street, Village/City"
          rows={4}
          required
          error={errors.address}
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        {/* PIN Code */}

        <div>

          <FormInput
            label="PIN Code"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter 6-digit PIN Code"
            maxLength={6}
            required
            error={errors.pincode}
          />

          {fetchingLocation && (

            <p className="flex items-center gap-2 text-sm text-blue-600 mt-2">

              <FaSpinner className="animate-spin text-xs" />

              Looking up location...

            </p>

          )}

          {pincodeError && (

            <p className="text-red-500 text-sm mt-2">

              {pincodeError}

            </p>

          )}

        </div>

        {/* District */}

        <div>

          <label className="flex items-center gap-2 mb-2 font-medium text-slate-700">

            <FaMapMarkerAlt className="text-yellow-500 text-sm" />

            District

            <span className="text-red-500">*</span>

          </label>

          <input
            type="text"
            value={formData.district}
            readOnly
            placeholder="Auto-filled from PIN Code"
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-slate-700"
          />

          {errors.district && (

            <p className="text-red-500 text-sm mt-1.5">

              {errors.district}

            </p>

          )}

        </div>

        {/* State */}

        <div>

          <label className="flex items-center gap-2 mb-2 font-medium text-slate-700">

            <FaFlag className="text-yellow-500 text-sm" />

            State

            <span className="text-red-500">*</span>

          </label>

          <input
            type="text"
            value={
              formData.state ||
              DEFAULT_STATE
            }
            readOnly
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-slate-700"
          />

        </div>

      </div>

    </FormSection>

  );

}

export default AddressDetails;