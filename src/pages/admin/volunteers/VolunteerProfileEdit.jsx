import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  ArrowLeft,
  Save,
  RefreshCw,
  UserRound,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  HeartHandshake,
  Clock3,
  Phone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

function VolunteerProfileEdit() {

  const { volunteerCode } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aadhaarChecking, setAadhaarChecking] = useState(false);

  const [error, setError] = useState("");
  const [aadhaarMessage, setAadhaarMessage] = useState("");
  const [aadhaarDuplicate, setAadhaarDuplicate] = useState(false);

  const [volunteer, setVolunteer] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",

    address_line1: "",
    address_line2: "",
    city: "",
    district: "",
    state: "",
    pincode: "",

    highest_qualification: "",
    course: "",
    profession: "",
    organization: "",
    years_of_experience: "",

    primary_interest: "",
    secondary_interest: "",
    skills: "",
    languages_known: "",
    previous_volunteer_experience: "",

    availability_weekdays: false,
    availability_weekends: false,
    availability_evenings: false,

    preferred_mode: "",

    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_mobile: "",

    volunteer_type: "REGULAR",

    short_bio: "",

    aadhaar: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Load Volunteer
  |--------------------------------------------------------------------------
  */

  const loadVolunteer = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/volunteers/admin/${volunteerCode}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          "Unable to load volunteer."
        );
      }

      const data = result.data;

      setVolunteer(data);

      setForm({
        full_name: data.full_name || "",
        date_of_birth: formatDateForInput(data.date_of_birth),
        gender: data.gender || "",

        address_line1: data.address_line1 || "",
        address_line2: data.address_line2 || "",
        city: data.city || "",
        district: data.district || "",
        state: data.state || "",
        pincode: data.pincode || "",

        highest_qualification:
          data.highest_qualification || "",

        course: data.course || "",
        profession: data.profession || "",
        organization: data.organization || "",

        years_of_experience:
          data.years_of_experience ?? "",

        primary_interest:
          data.primary_interest || "",

        secondary_interest:
          data.secondary_interest || "",

        skills: data.skills || "",

        languages_known:
          data.languages_known || "",

        previous_volunteer_experience:
          data.previous_volunteer_experience || "",

        availability_weekdays:
          Boolean(data.availability_weekdays),

        availability_weekends:
          Boolean(data.availability_weekends),

        availability_evenings:
          Boolean(data.availability_evenings),

        preferred_mode:
          data.preferred_mode || "",

        emergency_contact_name:
          data.emergency_contact_name || "",

        emergency_contact_relationship:
          data.emergency_contact_relationship || "",

        emergency_contact_mobile:
          data.emergency_contact_mobile || "",

        volunteer_type:
          data.volunteer_type || "REGULAR",

        short_bio:
          data.short_bio || "",

        aadhaar:
          data.aadhaar || "",
      });

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to load volunteer."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadVolunteer();

  }, [volunteerCode]);


  /*
  |--------------------------------------------------------------------------
  | Change Handler
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));


    if (name === "aadhaar") {

      setAadhaarDuplicate(false);
      setAadhaarMessage("");

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Aadhaar Duplicate Check
  |--------------------------------------------------------------------------
  */

  const checkAadhaar = async () => {

    const aadhaar =
      form.aadhaar
        .replace(/\D/g, "");

    if (aadhaar.length !== 12) {

      setAadhaarMessage(
        "Enter a valid 12-digit Aadhaar number."
      );

      setAadhaarDuplicate(false);

      return;

    }


    try {

      setAadhaarChecking(true);
      setAadhaarMessage("");
      setAadhaarDuplicate(false);


      /*
       * IMPORTANT:
       *
       * This endpoint should perform the
       * duplicate check on the backend.
       *
       * Never compare Aadhaar numbers
       * directly in React.
       */

      const response = await fetch(
        `${API_BASE_URL}/api/volunteers/admin/check-aadhaar`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            aadhaar,
            volunteer_code:
              volunteerCode,
          }),
        }
      );


      const result =
        await response.json();


      if (!response.ok) {

        if (
          result.code ===
          "VOLUNTEER_DUPLICATE"
        ) {

          setAadhaarDuplicate(true);

          setAadhaarMessage(
            result.message ||
            "This Aadhaar is already registered."
          );

          return;
        }

        throw new Error(
          result.message ||
          "Unable to verify Aadhaar."
        );

      }


      setAadhaarMessage(
        "Aadhaar is available."
      );

      setAadhaarDuplicate(false);

    } catch (err) {

      console.error(
        "Aadhaar check:",
        err
      );

      setAadhaarMessage(
        err.message ||
        "Unable to check Aadhaar."
      );

    } finally {

      setAadhaarChecking(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {

    if (!form.full_name.trim()) {
      return "Full name is required.";
    }

    if (!form.date_of_birth) {
      return "Date of birth is required.";
    }

    if (!form.gender) {
      return "Gender is required.";
    }

    if (!form.address_line1.trim()) {
      return "Address is required.";
    }

    if (!form.pincode.trim()) {
      return "Pincode is required.";
    }

    if (!form.highest_qualification.trim()) {
      return "Highest qualification is required.";
    }

    if (!form.profession.trim()) {
      return "Profession is required.";
    }

    if (!form.primary_interest.trim()) {
      return "Primary interest is required.";
    }

    if (!form.preferred_mode) {
      return "Preferred mode is required.";
    }

    if (!form.emergency_contact_name.trim()) {
      return "Emergency contact name is required.";
    }

    if (!form.emergency_contact_relationship.trim()) {
      return "Emergency contact relationship is required.";
    }

    if (!form.emergency_contact_mobile.trim()) {
      return "Emergency contact mobile is required.";
    }

    if (
      form.aadhaar &&
      form.aadhaar.replace(/\D/g, "").length !== 12
    ) {
      return "Aadhaar number must contain 12 digits.";
    }

    if (aadhaarDuplicate) {
      return "This Aadhaar number already belongs to another volunteer.";
    }

    return null;
  };


  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {

      await Swal.fire({
        icon: "warning",
        title: "Complete required fields",
        text: validationError,
        confirmButtonColor: "#4f46e5",
      });

      return;
    }


    try {

      setSaving(true);


      const payload = {
        ...form,

        aadhaar:
          form.aadhaar
            ? form.aadhaar.replace(/\D/g, "")
            : null,

        years_of_experience:
          form.years_of_experience === ""
            ? null
            : Number(form.years_of_experience),
      };


      const response = await fetch(
        `${API_BASE_URL}/api/volunteers/admin/${volunteerCode}/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );


      const result =
        await response.json();


      if (!response.ok || !result.success) {

        if (
          result.code ===
          "VOLUNTEER_DUPLICATE"
        ) {

          const duplicate =
            result.duplicates?.find(
              item =>
                item.field === "aadhaar"
            );

          setAadhaarDuplicate(true);

          setAadhaarMessage(
            duplicate?.message ||
            "Aadhaar already exists."
          );

        }

        throw new Error(
          result.message ||
          "Unable to update volunteer."
        );

      }


      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text:
          "Volunteer profile has been updated successfully.",
        confirmButtonColor: "#4f46e5",
      });


      navigate(
        `/admin/volunteers/${volunteerCode}`
      );

    } catch (err) {

      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          err.message ||
          "Unable to update volunteer.",
        confirmButtonColor: "#dc2626",
      });

    } finally {

      setSaving(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <RefreshCw
            className="mx-auto animate-spin text-indigo-600"
            size={28}
          />

          <p className="mt-3 text-sm font-semibold text-slate-700">
            Loading volunteer profile...
          </p>

        </div>

      </div>
    );

  }


  if (error) {

    return (
      <div className="min-h-screen bg-slate-50 p-6">

        <button
          onClick={() =>
            navigate("/admin/volunteers")
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
        >
          <ArrowLeft size={17} />
          Back to Volunteers
        </button>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-200 bg-white p-8">

          <AlertCircle
            className="text-red-600"
            size={28}
          />

          <h2 className="mt-3 font-bold text-slate-900">
            Unable to load volunteer
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

        </div>

      </div>
    );

  }


  return (

    <div className="min-h-screen bg-[#f6f8fc] p-4 sm:p-6 lg:p-7">

      <div className="mx-auto max-w-[1450px]">


        {/* ================================================================
            HEADER
        ================================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/volunteers/${volunteerCode}`
                )
              }
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
            >

              <ArrowLeft size={17} />

              Back to Review

            </button>


            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">

                <UserRound size={20} />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">

                  Complete Volunteer Profile

                </h1>

                <p className="mt-0.5 text-sm text-slate-500">

                  {volunteer.full_name} •{" "}
                  <span className="font-mono text-indigo-600">
                    {volunteer.volunteer_code}
                  </span>

                </p>

              </div>

            </div>

          </div>


          <div className="flex items-center gap-2">

            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">

              {volunteer.status}

            </span>

            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">

              {volunteer.profile_completion_percent}% Complete

            </span>

          </div>

        </div>


        {/* ================================================================
            FORM
        ================================================================= */}

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">


            {/* ============================================================
                MAIN
            ============================================================ */}

            <div className="space-y-6">


              <FormSection
                icon={<UserRound size={18} />}
                title="Personal Information"
                description="Complete the volunteer's identity information."
              >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                  <Input
                    label="Full Name"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Date of Birth"
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    required
                  />

                  <Select
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    options={[
                      ["", "Select Gender"],
                      ["MALE", "Male"],
                      ["FEMALE", "Female"],
                      ["OTHER", "Other"],
                      [
                        "PREFER_NOT_TO_SAY",
                        "Prefer not to say",
                      ],
                    ]}
                  />

                </div>

              </FormSection>


              {/* =========================================================
                  CONTACT / AADHAAR
              ========================================================= */}

              <FormSection
                icon={<ShieldCheck size={18} />}
                title="Identity & Contact Verification"
                description="Sensitive information is securely encrypted in the database."
              >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">


                  <div className="lg:col-span-2">

                    <label className="mb-1.5 block text-xs font-bold text-slate-600">

                      Aadhaar Number

                      <span className="ml-1 text-red-500">
                        *
                      </span>

                    </label>

                    <div className="flex gap-2">

                      <input
                        type="text"
                        name="aadhaar"
                        maxLength={14}
                        value={formatAadhaar(
                          form.aadhaar
                        )}
                        onChange={(e) => {

                          const value =
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 12);

                          setForm(previous => ({
                            ...previous,
                            aadhaar: value,
                          }));

                          setAadhaarDuplicate(false);
                          setAadhaarMessage("");

                        }}
                        placeholder="XXXX XXXX XXXX"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium tracking-wider text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />

                      <button
                        type="button"
                        onClick={checkAadhaar}
                        disabled={
                          aadhaarChecking ||
                          form.aadhaar.replace(/\D/g, "").length !== 12
                        }
                        className="rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        {aadhaarChecking ? (
                          <RefreshCw
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          "Check"
                        )}

                      </button>

                    </div>


                    {aadhaarMessage && (

                      <div
                        className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                          aadhaarDuplicate
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >

                        {aadhaarDuplicate ? (
                          <AlertCircle size={15} />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}

                        {aadhaarMessage}

                      </div>

                    )}

                  </div>


                  <Input
                    label="Emergency Mobile"
                    name="emergency_contact_mobile"
                    value={
                      form.emergency_contact_mobile
                    }
                    onChange={handleChange}
                    placeholder="10 digit mobile"
                  />

                </div>

              </FormSection>


              {/* =========================================================
                  ADDRESS
              ========================================================= */}

              <FormSection
                icon={<MapPin size={18} />}
                title="Address"
                description="Current residential details."
              >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <Input
                    label="Address Line 1"
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Address Line 2"
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                  />

                  <Input
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />

                  <Input
                    label="District"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                  />

                  <Input
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  />

                  <Input
                    label="Pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                  />

                </div>

              </FormSection>


              {/* =========================================================
                  EDUCATION
              ========================================================= */}

              <FormSection
                icon={<GraduationCap size={18} />}
                title="Education & Profession"
                description="Academic and professional information."
              >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                  <Input
                    label="Highest Qualification"
                    name="highest_qualification"
                    value={
                      form.highest_qualification
                    }
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Course"
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                  />

                  <Input
                    label="Profession"
                    name="profession"
                    value={form.profession}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Organization"
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                  />

                  <Input
                    label="Years of Experience"
                    type="number"
                    step="0.01"
                    min="0"
                    name="years_of_experience"
                    value={
                      form.years_of_experience
                    }
                    onChange={handleChange}
                  />

                  <Select
                    label="Volunteer Type"
                    name="volunteer_type"
                    value={form.volunteer_type}
                    onChange={handleChange}
                    options={[
                      ["REGULAR", "Regular"],
                      ["OCCASIONAL", "Occasional"],
                      ["STUDENT", "Student"],
                      ["PROFESSIONAL", "Professional"],
                      ["CORPORATE", "Corporate"],
                      ["OTHER", "Other"],
                    ]}
                  />

                </div>

              </FormSection>


              {/* =========================================================
                  INTERESTS
              ========================================================= */}

              <FormSection
                icon={<HeartHandshake size={18} />}
                title="Interests & Skills"
                description="Understand how the volunteer can contribute."
              >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <Input
                    label="Primary Interest"
                    name="primary_interest"
                    value={form.primary_interest}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Secondary Interest"
                    name="secondary_interest"
                    value={
                      form.secondary_interest
                    }
                    onChange={handleChange}
                  />

                  <TextArea
                    label="Skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="Teaching, documentation, technology..."
                  />

                  <TextArea
                    label="Languages Known"
                    name="languages_known"
                    value={
                      form.languages_known
                    }
                    onChange={handleChange}
                    placeholder="English, Telugu, Hindi..."
                  />

                  <div className="md:col-span-2">

                    <TextArea
                      label="Previous Volunteer Experience"
                      name="previous_volunteer_experience"
                      value={
                        form.previous_volunteer_experience
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </FormSection>


              {/* =========================================================
                  AVAILABILITY
              ========================================================= */}

              <FormSection
                icon={<Clock3 size={18} />}
                title="Availability"
                description="When and how the volunteer prefers to work."
              >

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <Checkbox
                    name="availability_weekdays"
                    checked={
                      form.availability_weekdays
                    }
                    onChange={handleChange}
                    title="Weekdays"
                  />

                  <Checkbox
                    name="availability_weekends"
                    checked={
                      form.availability_weekends
                    }
                    onChange={handleChange}
                    title="Weekends"
                  />

                  <Checkbox
                    name="availability_evenings"
                    checked={
                      form.availability_evenings
                    }
                    onChange={handleChange}
                    title="Evenings"
                  />

                </div>


                <div className="mt-5 max-w-md">

                  <Select
                    label="Preferred Mode"
                    name="preferred_mode"
                    value={form.preferred_mode}
                    onChange={handleChange}
                    required
                    options={[
                      ["", "Select Mode"],
                      ["ONLINE", "Online"],
                      ["OFFLINE", "Offline"],
                      ["BOTH", "Online & Offline"],
                    ]}
                  />

                </div>

              </FormSection>


              {/* =========================================================
                  EMERGENCY
              ========================================================= */}

              <FormSection
                icon={<Phone size={18} />}
                title="Emergency Contact"
                description="Someone the trust can contact if necessary."
              >

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                  <Input
                    label="Contact Name"
                    name="emergency_contact_name"
                    value={
                      form.emergency_contact_name
                    }
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Relationship"
                    name="emergency_contact_relationship"
                    value={
                      form.emergency_contact_relationship
                    }
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Mobile Number"
                    name="emergency_contact_mobile"
                    value={
                      form.emergency_contact_mobile
                    }
                    onChange={handleChange}
                    required
                  />

                </div>

              </FormSection>


              {/* =========================================================
                  BIO
              ========================================================= */}

              <FormSection
                icon={<BriefcaseBusiness size={18} />}
                title="Volunteer Bio"
                description="Optional public-facing information."
              >

                <TextArea
                  label="Short Bio"
                  name="short_bio"
                  value={form.short_bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write a short professional introduction..."
                />

              </FormSection>


              {/* =========================================================
                  ACTION BAR
              ========================================================= */}

              <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-2">

                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-indigo-600"
                    />

                    <div>

                      <p className="text-xs font-bold text-slate-700">

                        Secure profile update

                      </p>

                      <p className="text-[11px] text-slate-400">

                        Sensitive identity information is encrypted before storage.

                      </p>

                    </div>

                  </div>


                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/volunteers/${volunteerCode}`
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >

                      Cancel

                    </button>


                    <button
                      type="submit"
                      disabled={
                        saving ||
                        aadhaarDuplicate
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {saving ? (

                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />

                      ) : (

                        <Save size={17} />

                      )}

                      {saving
                        ? "Saving..."
                        : "Save Profile"}

                    </button>

                  </div>

                </div>

              </div>

            </div>


            {/* ============================================================
                SIDE PANEL
            ============================================================ */}

            <div className="space-y-5 xl:sticky xl:top-6 xl:self-start">


              {/* PROFILE STATUS */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                    <UserCheck size={20} />

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                      Profile Status

                    </p>

                    <p className="mt-0.5 text-lg font-bold text-slate-900">

                      {volunteer.profile_completion_percent}%

                    </p>

                  </div>

                </div>


                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{
                      width:
                        `${volunteer.profile_completion_percent}%`,
                    }}
                  />

                </div>


                <p className="mt-3 text-xs leading-5 text-slate-500">

                  Complete all required sections before sending this volunteer for approval.

                </p>

              </div>


              {/* ORIGINAL DATA */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <h3 className="font-bold text-slate-900">

                  Application

                </h3>


                <div className="mt-4 space-y-3">

                  <SideRow
                    label="Volunteer Code"
                    value={
                      volunteer.volunteer_code
                    }
                    mono
                  />

                  <SideRow
                    label="Source"
                    value={
                      volunteer.application_source
                    }
                  />

                  <SideRow
                    label="Status"
                    value={
                      volunteer.status
                    }
                  />

                  <SideRow
                    label="Created"
                    value={
                      formatDate(
                        volunteer.created_at
                      )
                    }
                  />

                </div>

              </div>


              {/* SECURITY */}

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

                <div className="flex gap-3">

                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <div>

                    <h3 className="text-sm font-bold text-indigo-900">

                      Security Protection

                    </h3>

                    <ul className="mt-2 space-y-2 text-[11px] leading-5 text-indigo-700">

                      <li>
                        • Aadhaar is encrypted.
                      </li>

                      <li>
                        • Duplicate checks use secure hashes.
                      </li>

                      <li>
                        • Sensitive values are masked in responses.
                      </li>

                      <li>
                        • Approval remains an admin-controlled action.
                      </li>

                    </ul>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>

  );
}


/* ==========================================================================
   FORM SECTION
========================================================================== */

function FormSection({
  icon,
  title,
  description,
  children,
}) {

  return (

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

            {icon}

          </div>

          <div>

            <h2 className="font-bold text-slate-900">

              {title}

            </h2>

            <p className="text-xs text-slate-400">

              {description}

            </p>

          </div>

        </div>

      </div>


      <div className="p-5 sm:p-6">

        {children}

      </div>

    </section>

  );

}


/* ==========================================================================
   INPUT
========================================================================== */

function Input({
  label,
  required,
  ...props
}) {

  return (

    <div>

      <label className="mb-1.5 block text-xs font-bold text-slate-600">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>


      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      />

    </div>

  );

}


/* ==========================================================================
   SELECT
========================================================================== */

function Select({
  label,
  required,
  options,
  ...props
}) {

  return (

    <div>

      <label className="mb-1.5 block text-xs font-bold text-slate-600">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>


      <select
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      >

        {options.map(
          ([value, label]) => (

            <option
              key={value}
              value={value}
            >
              {label}
            </option>

          )
        )}

      </select>

    </div>

  );

}


/* ==========================================================================
   TEXT AREA
========================================================================== */

function TextArea({
  label,
  required,
  rows = 4,
  ...props
}) {

  return (

    <div>

      <label className="mb-1.5 block text-xs font-bold text-slate-600">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>


      <textarea
        {...props}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      />

    </div>

  );

}


/* ==========================================================================
   CHECKBOX
========================================================================== */

function Checkbox({
  name,
  checked,
  onChange,
  title,
}) {

  return (

    <label
      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
        checked
          ? "border-indigo-200 bg-indigo-50"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >

      <div>

        <p className="text-sm font-bold text-slate-700">

          {title}

        </p>

        <p className="mt-0.5 text-[11px] text-slate-400">

          Volunteer availability

        </p>

      </div>


      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-indigo-600"
      />

    </label>

  );

}


/* ==========================================================================
   SIDE ROW
========================================================================== */

function SideRow({
  label,
  value,
  mono,
}) {

  return (

    <div className="flex items-start justify-between gap-4">

      <span className="text-xs text-slate-400">

        {label}

      </span>

      <span
        className={`text-right text-xs font-bold text-slate-700 ${
          mono ? "font-mono" : ""
        }`}
      >

        {value || "—"}

      </span>

    </div>

  );

}


/* ==========================================================================
   HELPERS
========================================================================== */

function formatDateForInput(value) {

  if (!value) {
    return "";
  }

  return String(value)
    .substring(0, 10);

}


function formatAadhaar(value) {

  const digits =
    String(value || "")
      .replace(/\D/g, "")
      .slice(0, 12);

  return digits.replace(
    /(\d{4})(?=\d)/g,
    "$1 "
  ).trim();

}


function formatDate(value) {

  if (!value) {
    return "—";
  }

  try {

    return new Date(
      value
    ).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  } catch {

    return value;

  }

}


export default VolunteerProfileEdit;