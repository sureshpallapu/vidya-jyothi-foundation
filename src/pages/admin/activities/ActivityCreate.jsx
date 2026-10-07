import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Globe2,
  ImagePlus,
  Info,
  Link2,
  Loader2,
  MapPin,
  Monitor,
  Save,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";

/* ============================================================================
   API
============================================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

/* ============================================================================
   OPTIONS
============================================================================ */

const ACTIVITY_TYPES = [
  {
    value: "EVENT",
    label: "Event",
    description: "General public or community event",
  },
  {
    value: "PROGRAM",
    label: "Program",
    description: "Structured education or welfare program",
  },
  {
    value: "CAMP",
    label: "Camp",
    description: "Health, education or community camp",
  },
  {
    value: "DRIVE",
    label: "Drive",
    description: "Community or awareness drive",
  },
  {
    value: "WORKSHOP",
    label: "Workshop",
    description: "Hands-on learning session",
  },
  {
    value: "MEETING",
    label: "Meeting",
    description: "Internal or external meeting",
  },
  {
    value: "AWARENESS",
    label: "Awareness",
    description: "Awareness and outreach activity",
  },
  {
    value: "DISTRIBUTION",
    label: "Distribution",
    description: "Distribution of educational or welfare resources",
  },
  {
    value: "VOLUNTEER_ACTIVITY",
    label: "Volunteer Activity",
    description: "Activity primarily involving volunteers",
  },
  {
    value: "FUNDRAISING",
    label: "Fundraising",
    description: "Fundraising or donor engagement activity",
  },
  {
    value: "OTHER",
    label: "Other",
    description: "Other activity type",
  },
];

const STATUS_OPTIONS = [
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "SCHEDULED",
    label: "Scheduled",
  },
  {
    value: "REGISTRATION_OPEN",
    label: "Registration Open",
  },
];

const PRIORITY_OPTIONS = [
  {
    value: "LOW",
    label: "Low",
  },
  {
    value: "NORMAL",
    label: "Normal",
  },
  {
    value: "HIGH",
    label: "High",
  },
  {
    value: "URGENT",
    label: "Urgent",
  },
];

/* ============================================================================
   DEFAULT FORM
============================================================================ */

const INITIAL_FORM = {
  title: "",
  activity_type: "EVENT",
  category: "",

  description: "",
  short_description: "",
  objective: "",

  start_date: "",
  start_time: "10:00",
  end_date: "",
  end_time: "14:00",

  is_all_day: false,
  timezone: "Asia/Kolkata",

  venue_name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  district: "",
  state: "Andhra Pradesh",
  pincode: "",

  latitude: "",
  longitude: "",

  online_event: false,
  meeting_url: "",

  max_participants: "",

  registration_required: false,
  registration_start: "",
  registration_end: "",

  visibility: "PUBLIC",

  /*
   * We allow admin to select the initial workflow status,
   * but public_display is NEVER controlled here.
   */
  status: "DRAFT",

  priority: "NORMAL",

  featured: false,
};

/* ============================================================================
   HELPERS
============================================================================ */

function InputLabel({
  children,
  required = false,
  hint = "",
}) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-bold text-slate-800">
        {children}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {hint && (
        <p className="mt-1 text-[11px] leading-4 text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
  badge,
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Icon size={20} />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {badge && (
        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {badge}
        </span>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`
        w-full
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        text-sm
        font-medium
        text-slate-800
        outline-none
        transition
        placeholder:text-slate-300
        hover:border-slate-300
        focus:border-indigo-400
        focus:ring-4
        focus:ring-indigo-50
        disabled:cursor-not-allowed
        disabled:bg-slate-50
        disabled:text-slate-400
        ${className}
      `}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 5,
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="
        w-full
        resize-y
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        text-sm
        font-medium
        leading-6
        text-slate-800
        outline-none
        transition
        placeholder:text-slate-300
        hover:border-slate-300
        focus:border-indigo-400
        focus:ring-4
        focus:ring-indigo-50
      "
    />
  );
}

function SelectInput({
  value,
  onChange,
  children,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="
          w-full
          appearance-none
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-3
          pr-10
          text-sm
          font-semibold
          text-slate-800
          outline-none
          transition
          hover:border-slate-300
          focus:border-indigo-400
          focus:ring-4
          focus:ring-indigo-50
        "
      >
        {children}
      </select>

      <ChevronDown
        size={17}
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  description,
  icon: Icon,
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        w-full
        rounded-2xl
        border
        p-4
        text-left
        transition-all
        ${
          checked
            ? "border-indigo-200 bg-indigo-50/70"
            : "border-slate-200 bg-white hover:border-slate-300"
        }
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${
                checked
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-slate-100 text-slate-500"
              }
            `}
          >
            <Icon size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800">
              {title}
            </p>

            <p className="mt-1 text-[11px] leading-4 text-slate-400">
              {description}
            </p>
          </div>
        </div>

        <div
          className={`
            relative
            h-6
            w-11
            shrink-0
            rounded-full
            transition
            ${
              checked
                ? "bg-indigo-600"
                : "bg-slate-200"
            }
          `}
        >
          <span
            className={`
              absolute
              top-1
              h-4
              w-4
              rounded-full
              bg-white
              shadow-sm
              transition
              ${
                checked
                  ? "left-6"
                  : "left-1"
              }
            `}
          />
        </div>
      </div>
    </button>
  );
}

function InfoBox({
  icon: Icon = Info,
  children,
  tone = "blue",
}) {
  const tones = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <div
      className={`
        flex
        items-start
        gap-3
        rounded-2xl
        border
        p-4
        text-xs
        leading-5
        ${tones[tone]}
      `}
    >
      <Icon
        size={17}
        className="mt-0.5 shrink-0"
      />

      <div>{children}</div>
    </div>
  );
}

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

export default function ActivityCreate() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [coverImageFile, setCoverImageFile] =
    useState(null);

  const [coverPreview, setCoverPreview] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState({});


  /* ========================================================================
     FORM UPDATE
  ======================================================================== */

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setError("");
  };


  /* ========================================================================
     IMAGE
  ======================================================================== */

  const handleImageSelect = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;


    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Please select a JPG, JPEG, PNG, WEBP or GIF image."
      );

      event.target.value = "";
      return;
    }


    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {
      setError(
        "Cover image must be 5 MB or smaller."
      );

      event.target.value = "";
      return;
    }


    setCoverImageFile(file);

    setCoverPreview(
      URL.createObjectURL(file)
    );

    setError("");
  };


  const removeCoverImage = () => {
    if (coverPreview) {
      URL.revokeObjectURL(
        coverPreview
      );
    }

    setCoverImageFile(null);
    setCoverPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };


  /* ========================================================================
     VALIDATION
  ======================================================================== */

  const validateForm = () => {
    const errors = {};


    if (!form.title.trim()) {
      errors.title =
        "Activity title is required.";
    }


    if (!form.start_date) {
      errors.start_date =
        "Start date is required.";
    }


    if (
      form.end_date &&
      form.start_date &&
      form.end_date <
        form.start_date
    ) {
      errors.end_date =
        "End date cannot be earlier than start date.";
    }


    if (
      form.online_event &&
      !form.meeting_url.trim()
    ) {
      errors.meeting_url =
        "Meeting URL is required for an online event.";
    }


    if (
      form.registration_required
    ) {
      if (!form.registration_start) {
        errors.registration_start =
          "Registration start is required.";
      }

      if (!form.registration_end) {
        errors.registration_end =
          "Registration end is required.";
      }

      if (
        form.registration_start &&
        form.registration_end &&
        form.registration_end <
          form.registration_start
      ) {
        errors.registration_end =
          "Registration end cannot be before registration start.";
      }
    }


    if (
      form.max_participants !== "" &&
      (
        Number(form.max_participants) <=
          0 ||
        !Number.isInteger(
          Number(form.max_participants)
        )
      )
    ) {
      errors.max_participants =
        "Enter a valid positive whole number.";
    }


    if (
      form.pincode &&
      !/^\d{6}$/.test(
        form.pincode
      )
    ) {
      errors.pincode =
        "Pincode must contain 6 digits.";
    }


    setFieldErrors(errors);

    return (
      Object.keys(errors)
        .length === 0
    );
  };


  /* ========================================================================
     BUILD FORM DATA
  ======================================================================== */

  const buildFormData = () => {
    const data =
      new FormData();


    /*
     * BASIC INFORMATION
     */

    data.append(
      "title",
      form.title.trim()
    );

    data.append(
      "activity_type",
      form.activity_type
    );

    if (form.category.trim()) {
      data.append(
        "category",
        form.category.trim()
      );
    }

    if (form.description.trim()) {
      data.append(
        "description",
        form.description.trim()
      );
    }

    if (
      form.short_description.trim()
    ) {
      data.append(
        "short_description",
        form.short_description.trim()
      );
    }

    if (form.objective.trim()) {
      data.append(
        "objective",
        form.objective.trim()
      );
    }


    /*
     * DATE / TIME
     */

    data.append(
      "start_date",
      form.start_date
    );

    if (form.start_time) {
      data.append(
        "start_time",
        form.start_time
      );
    }

    if (form.end_date) {
      data.append(
        "end_date",
        form.end_date
      );
    }

    if (form.end_time) {
      data.append(
        "end_time",
        form.end_time
      );
    }

    data.append(
      "is_all_day",
      form.is_all_day
        ? "true"
        : "false"
    );

    data.append(
      "timezone",
      form.timezone
    );


    /*
     * LOCATION
     */

    const locationFields = [
      "venue_name",
      "address_line1",
      "address_line2",
      "city",
      "district",
      "state",
      "pincode",
      "latitude",
      "longitude",
    ];


    locationFields.forEach(
      (field) => {
        if (
          form[field] !==
            undefined &&
          form[field] !== null &&
          String(
            form[field]
          ).trim() !== ""
        ) {
          data.append(
            field,
            String(
              form[field]
            ).trim()
          );
        }
      }
    );


    /*
     * ONLINE EVENT
     */

    data.append(
      "online_event",
      form.online_event
        ? "true"
        : "false"
    );

    if (
      form.meeting_url.trim()
    ) {
      data.append(
        "meeting_url",
        form.meeting_url.trim()
      );
    }


    /*
     * PARTICIPANTS
     */

    if (
      form.max_participants !==
      ""
    ) {
      data.append(
        "max_participants",
        String(
          form.max_participants
        )
      );
    }


    /*
     * REGISTRATION
     */

    data.append(
      "registration_required",
      form.registration_required
        ? "true"
        : "false"
    );


    if (
      form.registration_required
    ) {
      if (
        form.registration_start
      ) {
        data.append(
          "registration_start",
          form.registration_start
        );
      }

      if (
        form.registration_end
      ) {
        data.append(
          "registration_end",
          form.registration_end
        );
      }
    }


    /*
     * WORKFLOW
     */

    data.append(
      "visibility",
      form.visibility
    );

    data.append(
      "status",
      form.status
    );

    data.append(
      "priority",
      form.priority
    );

    data.append(
      "featured",
      form.featured
        ? "true"
        : "false"
    );


    /*
     * IMPORTANT
     *
     * DO NOT SEND public_display.
     *
     * Backend intentionally creates every
     * new activity with public_display = 0.
     */


    /*
     * COVER IMAGE
     */

    if (coverImageFile) {
      data.append(
        "cover_image",
        coverImageFile
      );
    }


    return data;
  };


  /* ========================================================================
     SUBMIT
  ======================================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();


    if (saving) return;


    setError("");
    setSuccess("");


    const valid =
      validateForm();


    if (!valid) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }


    try {
      setSaving(true);


      const formData =
        buildFormData();


      const response =
        await fetch(
          `${API_BASE_URL}/activities`,
          {
            method: "POST",

            /*
             * IMPORTANT:
             *
             * Do NOT manually set
             * Content-Type here.
             *
             * Browser automatically adds
             * multipart/form-data boundary.
             */
            body: formData,
          }
        );


      let result = null;


      try {
        result =
          await response.json();
      } catch {
        result = null;
      }


      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            `Unable to create activity. HTTP ${response.status}`
        );
      }


      if (
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            "Unable to create activity."
        );
      }


      setSuccess(
        "Activity created successfully. It is currently hidden from the public website."
      );


      /*
       * Give the success message a moment
       * before returning to activities.
       */
      setTimeout(() => {
        navigate(
          "/admin/activities",
          {
            replace: true,
            state: {
              activityCreated: true,
              activity:
                result.data || null,
            },
          }
        );
      }, 900);

    } catch (submitError) {
      console.error(
        "CREATE ACTIVITY ERROR:",
        submitError
      );

      setError(
        submitError?.message ||
          "Unable to create activity."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } finally {
      setSaving(false);
    }
  };


  /* ========================================================================
     SUMMARY
  ======================================================================== */

  const selectedType =
    useMemo(
      () =>
        ACTIVITY_TYPES.find(
          (item) =>
            item.value ===
            form.activity_type
        ),
      [form.activity_type]
    );


  const registrationStatus =
    form.registration_required
      ? "Required"
      : "Not required";


  /* ========================================================================
     RENDER
  ======================================================================== */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ====================================================================
          TOP HEADER
      ==================================================================== */}

      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/activities"
                )
              }
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-600
                transition
                hover:border-slate-300
                hover:bg-slate-50
              "
              title="Back to Activities"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <Activity
                  size={18}
                  className="text-indigo-600"
                />

                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Activity Management
                </span>

              </div>

              <h1 className="mt-1 truncate text-xl font-black text-slate-900 sm:text-2xl">
                Create Activity
              </h1>

            </div>
          </div>


          <div className="hidden items-center gap-3 sm:flex">

            <div className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-amber-200
              bg-amber-50
              px-3
              py-2
              text-[11px]
              font-bold
              text-amber-700
            ">
              <ShieldCheck size={14} />
              Private until published
            </div>

          </div>

        </div>
      </div>


      {/* ====================================================================
          CONTENT
      ==================================================================== */}

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ==================================================================
            ALERTS
        ================================================================== */}

        {error && (
          <div className="
            mb-6
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-red-700
          ">

            <X
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div className="min-w-0">

              <p className="text-sm font-bold">
                Unable to create activity
              </p>

              <p className="mt-1 text-xs leading-5">
                {error}
              </p>

            </div>

          </div>
        )}


        {success && (
          <div className="
            mb-6
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-emerald-700
          ">

            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>

              <p className="text-sm font-bold">
                Activity created
              </p>

              <p className="mt-1 text-xs leading-5">
                {success}
              </p>

            </div>

          </div>
        )}


        {/* ==================================================================
            PRIVATE NOTICE
        ================================================================== */}

        <InfoBox tone="amber" icon={ShieldCheck}>

          <p className="font-bold">
            Public visibility is controlled separately.
          </p>

          <p className="mt-1">
            This activity will be created as private
            ({`public_display = 0`}). After reviewing the
            activity, an administrator can use
            <strong> Show Public </strong>
            from the activity management screen.
          </p>

        </InfoBox>


        {/* ==================================================================
            FORM
        ================================================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">


            {/* ==============================================================
                LEFT
            ============================================================== */}

            <div className="space-y-6">


              {/* ============================================================
                  BASIC INFORMATION
              ============================================================ */}

              <section className="
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200
                bg-white
                shadow-sm
              ">

                <SectionHeader
                  icon={Activity}
                  title="Basic Information"
                  description="Define what this activity is about."
                  badge="Step 01"
                />


                <div className="space-y-6 p-6">


                  {/* TITLE */}

                  <div>

                    <InputLabel required>
                      Activity Title
                    </InputLabel>

                    <TextInput
                      value={form.title}
                      onChange={(e) =>
                        updateField(
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Education Awareness Program"
                    />

                    {fieldErrors.title && (
                      <p className="mt-2 text-xs font-semibold text-red-500">
                        {fieldErrors.title}
                      </p>
                    )}

                  </div>


                  {/* TYPE + CATEGORY */}

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>

                      <InputLabel required>
                        Activity Type
                      </InputLabel>

                      <SelectInput
                        value={
                          form.activity_type
                        }
                        onChange={(e) =>
                          updateField(
                            "activity_type",
                            e.target.value
                          )
                        }
                      >

                        {ACTIVITY_TYPES.map(
                          (type) => (
                            <option
                              key={
                                type.value
                              }
                              value={
                                type.value
                              }
                            >
                              {type.label}
                            </option>
                          )
                        )}

                      </SelectInput>

                      {selectedType && (
                        <p className="mt-2 text-[11px] text-slate-400">
                          {selectedType.description}
                        </p>
                      )}

                    </div>


                    <div>

                      <InputLabel>
                        Category
                      </InputLabel>

                      <TextInput
                        value={
                          form.category
                        }
                        onChange={(e) =>
                          updateField(
                            "category",
                            e.target.value
                          )
                        }
                        placeholder="Education, Health, Community..."
                      />

                    </div>

                  </div>


                  {/* SHORT DESCRIPTION */}

                  <div>

                    <InputLabel
                      hint="A short version displayed in activity cards."
                    >
                      Short Description
                    </InputLabel>

                    <TextArea
                      value={
                        form.short_description
                      }
                      onChange={(e) =>
                        updateField(
                          "short_description",
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Briefly describe this activity..."
                    />

                  </div>


                  {/* DESCRIPTION */}

                  <div>

                    <InputLabel>
                      Full Description
                    </InputLabel>

                    <TextArea
                      value={
                        form.description
                      }
                      onChange={(e) =>
                        updateField(
                          "description",
                          e.target.value
                        )
                      }
                      rows={6}
                      placeholder="Provide complete details about the activity..."
                    />

                  </div>


                  {/* OBJECTIVE */}

                  <div>

                    <InputLabel>
                      Objective
                    </InputLabel>

                    <TextArea
                      value={
                        form.objective
                      }
                      onChange={(e) =>
                        updateField(
                          "objective",
                          e.target.value
                        )
                      }
                      rows={4}
                      placeholder="What should this activity achieve?"
                    />

                  </div>

                </div>

              </section>


              {/* ============================================================
                  COVER IMAGE
              ============================================================ */}

              <section className="
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200
                bg-white
                shadow-sm
              ">

                <SectionHeader
                  icon={ImagePlus}
                  title="Cover Image"
                  description="Upload the image that will represent this activity."
                  badge="Media"
                />


                <div className="p-6">

                  {!coverPreview ? (

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="
                        group
                        flex
                        min-h-[280px]
                        w-full
                        flex-col
                        items-center
                        justify-center
                        rounded-[22px]
                        border-2
                        border-dashed
                        border-slate-200
                        bg-slate-50
                        px-6
                        text-center
                        transition
                        hover:border-indigo-300
                        hover:bg-indigo-50/30
                      "
                    >

                      <div className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white
                        text-indigo-600
                        shadow-sm
                        ring-1
                        ring-slate-200
                        transition
                        group-hover:scale-105
                      ">
                        <UploadCloud
                          size={27}
                        />
                      </div>

                      <p className="mt-5 text-sm font-bold text-slate-800">
                        Upload activity cover image
                      </p>

                      <p className="mt-2 max-w-md text-xs leading-5 text-slate-400">
                        JPG, JPEG, PNG, WEBP or GIF.
                        Maximum file size: 5 MB.
                      </p>

                      <span className="
                        mt-5
                        rounded-xl
                        bg-indigo-600
                        px-4
                        py-2.5
                        text-xs
                        font-bold
                        text-white
                        shadow-sm
                      ">
                        Choose Image
                      </span>

                    </button>

                  ) : (

                    <div className="
                      overflow-hidden
                      rounded-[22px]
                      border
                      border-slate-200
                      bg-slate-50
                    ">

                      <div className="relative">

                        <img
                          src={
                            coverPreview
                          }
                          alt="Activity cover preview"
                          className="
                            h-[300px]
                            w-full
                            object-cover
                            sm:h-[380px]
                          "
                        />

                        <div className="
                          absolute
                          inset-x-0
                          bottom-0
                          flex
                          items-end
                          justify-between
                          gap-3
                          bg-gradient-to-t
                          from-black/70
                          to-transparent
                          p-5
                          pt-16
                        ">

                          <div className="min-w-0">

                            <p className="text-xs font-bold text-white">
                              Cover Image
                            </p>

                            <p className="mt-1 truncate text-[11px] text-white/70">
                              {coverImageFile?.name}
                            </p>

                          </div>

                          <div className="flex shrink-0 gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                fileInputRef.current?.click()
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-white
                                px-3
                                py-2
                                text-xs
                                font-bold
                                text-slate-800
                                shadow
                              "
                            >
                              <ImagePlus
                                size={14}
                              />
                              Change
                            </button>

                            <button
                              type="button"
                              onClick={
                                removeCoverImage
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-red-500
                                px-3
                                py-2
                                text-xs
                                font-bold
                                text-white
                                shadow
                              "
                            >
                              <Trash2
                                size={14}
                              />
                              Remove
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  )}

<input
  type="file"
  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
  onChange={(event) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      cover_image: file,
    }));

  }}
/>


                  <p className="mt-3 text-[11px] leading-5 text-slate-400">
                    The uploaded file is stored by the
                    backend and saved in the activity
                    <code className="mx-1 rounded bg-slate-100 px-1 py-0.5">
                      cover_image
                    </code>
                    field.
                  </p>

                </div>

              </section>


              {/* ============================================================
                  DATE & TIME
              ============================================================ */}

              <section className="
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200
                bg-white
                shadow-sm
              ">

                <SectionHeader
                  icon={CalendarDays}
                  title="Date & Time"
                  description="Set when the activity will happen."
                  badge="Step 02"
                />


                <div className="space-y-6 p-6">


                  <Toggle
                    checked={
                      form.is_all_day
                    }
                    onChange={(value) =>
                      updateField(
                        "is_all_day",
                        value
                      )
                    }
                    icon={CalendarDays}
                    title="All-day activity"
                    description="Use this when the activity does not have a specific time."
                  />


                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>

                      <InputLabel required>
                        Start Date
                      </InputLabel>

                      <TextInput
                        type="date"
                        value={
                          form.start_date
                        }
                        onChange={(e) =>
                          updateField(
                            "start_date",
                            e.target.value
                          )
                        }
                      />

                      {fieldErrors.start_date && (
                        <p className="mt-2 text-xs font-semibold text-red-500">
                          {fieldErrors.start_date}
                        </p>
                      )}

                    </div>


                    <div>

                      <InputLabel>
                        End Date
                      </InputLabel>

                      <TextInput
                        type="date"
                        value={
                          form.end_date
                        }
                        onChange={(e) =>
                          updateField(
                            "end_date",
                            e.target.value
                          )
                        }
                      />

                      {fieldErrors.end_date && (
                        <p className="mt-2 text-xs font-semibold text-red-500">
                          {fieldErrors.end_date}
                        </p>
                      )}

                    </div>


                    {!form.is_all_day && (
                      <>
                        <div>

                          <InputLabel>
                            Start Time
                          </InputLabel>

                          <TextInput
                            type="time"
                            value={
                              form.start_time
                            }
                            onChange={(e) =>
                              updateField(
                                "start_time",
                                e.target.value
                              )
                            }
                          />

                        </div>


                        <div>

                          <InputLabel>
                            End Time
                          </InputLabel>

                          <TextInput
                            type="time"
                            value={
                              form.end_time
                            }
                            onChange={(e) =>
                              updateField(
                                "end_time",
                                e.target.value
                              )
                            }
                          />

                        </div>
                      </>
                    )}

                  </div>


                  <div>

                    <InputLabel>
                      Timezone
                    </InputLabel>

                    <SelectInput
                      value={
                        form.timezone
                      }
                      onChange={(e) =>
                        updateField(
                          "timezone",
                          e.target.value
                        )
                      }
                    >
                      <option value="Asia/Kolkata">
                        Asia/Kolkata (IST)
                      </option>

                      <option value="UTC">
                        UTC
                      </option>
                    </SelectInput>

                  </div>

                </div>

              </section>


              {/* ============================================================
                  LOCATION
              ============================================================ */}

              <section className="
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200
                bg-white
                shadow-sm
              ">

                <SectionHeader
                  icon={MapPin}
                  title="Location"
                  description="Specify where this activity will take place."
                  badge="Venue"
                />


                <div className="space-y-6 p-6">

                  <Toggle
                    checked={
                      form.online_event
                    }
                    onChange={(value) =>
                      updateField(
                        "online_event",
                        value
                      )
                    }
                    icon={Globe2}
                    title="Online activity"
                    description="Enable this when participants will join remotely."
                  />


                  {form.online_event ? (

                    <div>

                      <InputLabel
                        required
                        hint="Example: Zoom, Google Meet or Microsoft Teams link."
                      >
                        Meeting URL
                      </InputLabel>

                      <div className="relative">

                        <Link2
                          size={17}
                          className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                          "
                        />

                        <TextInput
                          value={
                            form.meeting_url
                          }
                          onChange={(e) =>
                            updateField(
                              "meeting_url",
                              e.target.value
                            )
                          }
                          placeholder="https://..."
                          className="pl-11"
                        />

                      </div>

                      {fieldErrors.meeting_url && (
                        <p className="mt-2 text-xs font-semibold text-red-500">
                          {fieldErrors.meeting_url}
                        </p>
                      )}

                    </div>

                  ) : (

                    <div className="space-y-5">

                      <div>

                        <InputLabel>
                          Venue Name
                        </InputLabel>

                        <TextInput
                          value={
                            form.venue_name
                          }
                          onChange={(e) =>
                            updateField(
                              "venue_name",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Vidya Jyothi Foundation"
                        />

                      </div>


                      <div>

                        <InputLabel>
                          Address Line 1
                        </InputLabel>

                        <TextInput
                          value={
                            form.address_line1
                          }
                          onChange={(e) =>
                            updateField(
                              "address_line1",
                              e.target.value
                            )
                          }
                          placeholder="Main Road"
                        />

                      </div>


                      <div>

                        <InputLabel>
                          Address Line 2
                        </InputLabel>

                        <TextInput
                          value={
                            form.address_line2
                          }
                          onChange={(e) =>
                            updateField(
                              "address_line2",
                              e.target.value
                            )
                          }
                          placeholder="Landmark, building, area..."
                        />

                      </div>


                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>

                          <InputLabel>
                            City
                          </InputLabel>

                          <TextInput
                            value={
                              form.city
                            }
                            onChange={(e) =>
                              updateField(
                                "city",
                                e.target.value
                              )
                            }
                            placeholder="Guntur"
                          />

                        </div>


                        <div>

                          <InputLabel>
                            District
                          </InputLabel>

                          <TextInput
                            value={
                              form.district
                            }
                            onChange={(e) =>
                              updateField(
                                "district",
                                e.target.value
                              )
                            }
                            placeholder="Guntur"
                          />

                        </div>


                        <div>

                          <InputLabel>
                            State
                          </InputLabel>

                          <TextInput
                            value={
                              form.state
                            }
                            onChange={(e) =>
                              updateField(
                                "state",
                                e.target.value
                              )
                            }
                            placeholder="Andhra Pradesh"
                          />

                        </div>


                        <div>

                          <InputLabel>
                            Pincode
                          </InputLabel>

                          <TextInput
                            value={
                              form.pincode
                            }
                            onChange={(e) =>
                              updateField(
                                "pincode",
                                e.target.value.replace(
                                  /\D/g,
                                  ""
                                ).slice(
                                  0,
                                  6
                                )
                              )
                            }
                            placeholder="522005"
                            inputMode="numeric"
                          />

                          {fieldErrors.pincode && (
                            <p className="mt-2 text-xs font-semibold text-red-500">
                              {fieldErrors.pincode}
                            </p>
                          )}

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              </section>


              {/* ============================================================
                  REGISTRATION
              ============================================================ */}

              <section className="
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200
                bg-white
                shadow-sm
              ">

                <SectionHeader
                  icon={Users}
                  title="Volunteer Registration"
                  description="Control whether volunteers can register for this activity."
                  badge="Step 03"
                />


                <div className="space-y-6 p-6">

                  <Toggle
                    checked={
                      form.registration_required
                    }
                    onChange={(value) =>
                      updateField(
                        "registration_required",
                        value
                      )
                    }
                    icon={UserIcon}
                    title="Registration required"
                    description="When enabled, eligible volunteers can register for this activity."
                  />


                  {form.registration_required && (

                    <div className="space-y-5">

                      <InfoBox
                        tone="green"
                        icon={CheckCircle2}
                      >
                        <p className="font-bold">
                          Volunteer registration enabled
                        </p>

                        <p className="mt-1">
                          The public activity page can show
                          the <strong>Register as Volunteer</strong>
                          action when the registration window
                          is open.
                        </p>
                      </InfoBox>


                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>

                          <InputLabel required>
                            Registration Starts
                          </InputLabel>

                          <TextInput
                            type="datetime-local"
                            value={
                              form.registration_start
                            }
                            onChange={(e) =>
                              updateField(
                                "registration_start",
                                e.target.value
                              )
                            }
                          />

                          {fieldErrors.registration_start && (
                            <p className="mt-2 text-xs font-semibold text-red-500">
                              {
                                fieldErrors.registration_start
                              }
                            </p>
                          )}

                        </div>


                        <div>

                          <InputLabel required>
                            Registration Ends
                          </InputLabel>

                          <TextInput
                            type="datetime-local"
                            value={
                              form.registration_end
                            }
                            onChange={(e) =>
                              updateField(
                                "registration_end",
                                e.target.value
                              )
                            }
                          />

                          {fieldErrors.registration_end && (
                            <p className="mt-2 text-xs font-semibold text-red-500">
                              {
                                fieldErrors.registration_end
                              }
                            </p>
                          )}

                        </div>

                      </div>


                      <div>

                        <InputLabel
                          hint="Leave empty if the activity has no participant limit."
                        >
                          Maximum Participants
                        </InputLabel>

                        <div className="relative">

                          <Users
                            size={17}
                            className="
                              pointer-events-none
                              absolute
                              left-4
                              top-1/2
                              -translate-y-1/2
                              text-slate-400
                            "
                          />

                          <TextInput
                            type="number"
                            min="1"
                            value={
                              form.max_participants
                            }
                            onChange={(e) =>
                              updateField(
                                "max_participants",
                                e.target.value
                              )
                            }
                            placeholder="100"
                            className="pl-11"
                          />

                        </div>

                        {fieldErrors.max_participants && (
                          <p className="mt-2 text-xs font-semibold text-red-500">
                            {
                              fieldErrors.max_participants
                            }
                          </p>
                        )}

                      </div>

                    </div>

                  )}

                </div>

              </section>


              {/* ============================================================
                  PUBLISH / WORKFLOW
              ============================================================ */}

              <section className="
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200
                bg-white
                shadow-sm
              ">

                <SectionHeader
                  icon={Zap}
                  title="Workflow & Priority"
                  description="Set the initial administrative workflow state."
                  badge="Admin"
                />


                <div className="space-y-6 p-6">

                  <InfoBox
                    tone="amber"
                    icon={ShieldCheck}
                  >
                    <p className="font-bold">
                      Public publishing is intentionally separated.
                    </p>

                    <p className="mt-1">
                      Creating this activity will never make
                      it visible on the public website.
                      Use <strong>Show Public</strong> later
                      from the activity management page.
                    </p>
                  </InfoBox>


                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    <div>

                      <InputLabel>
                        Initial Status
                      </InputLabel>

                      <SelectInput
                        value={
                          form.status
                        }
                        onChange={(e) =>
                          updateField(
                            "status",
                            e.target.value
                          )
                        }
                      >

                        {STATUS_OPTIONS.map(
                          (item) => (
                            <option
                              key={
                                item.value
                              }
                              value={
                                item.value
                              }
                            >
                              {item.label}
                            </option>
                          )
                        )}

                      </SelectInput>

                    </div>


                    <div>

                      <InputLabel>
                        Priority
                      </InputLabel>

                      <SelectInput
                        value={
                          form.priority
                        }
                        onChange={(e) =>
                          updateField(
                            "priority",
                            e.target.value
                          )
                        }
                      >

                        {PRIORITY_OPTIONS.map(
                          (item) => (
                            <option
                              key={
                                item.value
                              }
                              value={
                                item.value
                              }
                            >
                              {item.label}
                            </option>
                          )
                        )}

                      </SelectInput>

                    </div>


                    <div>

                      <InputLabel>
                        Visibility
                      </InputLabel>

                      <SelectInput
                        value={
                          form.visibility
                        }
                        onChange={(e) =>
                          updateField(
                            "visibility",
                            e.target.value
                          )
                        }
                      >

                        <option value="PUBLIC">
                          Public
                        </option>

                        <option value="PRIVATE">
                          Private
                        </option>

                        <option value="INTERNAL">
                          Internal
                        </option>

                      </SelectInput>

                    </div>

                  </div>


                  <Toggle
                    checked={
                      form.featured
                    }
                    onChange={(value) =>
                      updateField(
                        "featured",
                        value
                      )
                    }
                    icon={Zap}
                    title="Featured activity"
                    description="Mark this activity as featured for administrative/public presentation after publishing."
                  />

                </div>

              </section>

            </div>


            {/* ==============================================================
                RIGHT SIDEBAR
            ============================================================== */}

            <aside className="space-y-6 xl:sticky xl:top-[92px] xl:self-start">


              {/* ============================================================
                  LIVE SUMMARY
              ============================================================ */}

              <section className="
                overflow-hidden
                rounded-[24px]
                border
                border-slate-200
                bg-white
                shadow-sm
              ">

                <div className="
                  border-b
                  border-slate-100
                  bg-slate-900
                  px-5
                  py-5
                  text-white
                ">

                  <div className="flex items-center gap-3">

                    <div className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/10
                    ">
                      <Monitor
                        size={18}
                      />
                    </div>

                    <div>

                      <h2 className="text-sm font-bold">
                        Activity Preview
                      </h2>

                      <p className="mt-1 text-[11px] text-white/50">
                        Live summary
                      </p>

                    </div>

                  </div>

                </div>


                <div className="p-5">

                  <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                  ">

                    {coverPreview ? (

                      <img
                        src={
                          coverPreview
                        }
                        alt=""
                        className="
                          h-40
                          w-full
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        flex
                        h-40
                        items-center
                        justify-center
                        bg-gradient-to-br
                        from-indigo-50
                        to-slate-100
                        text-indigo-300
                      ">
                        <ImagePlus
                          size={35}
                        />
                      </div>

                    )}


                    <div className="space-y-3 p-4">

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {selectedType?.label ||
                            "Activity"}
                        </p>

                        <h3 className="mt-1 line-clamp-2 text-base font-black text-slate-900">
                          {form.title ||
                            "Your activity title"}
                        </h3>

                      </div>


                      <div className="space-y-2">

                        <div className="flex items-center gap-2 text-xs text-slate-500">

                          <CalendarDays
                            size={14}
                          />

                          <span>
                            {form.start_date ||
                              "Date not selected"}
                          </span>

                        </div>


                        {!form.is_all_day &&
                          form.start_time && (

                            <div className="flex items-center gap-2 text-xs text-slate-500">

                              <Clock3
                                size={14}
                              />

                              <span>
                                {
                                  form.start_time
                                }

                                {form.end_time &&
                                  ` – ${form.end_time}`}
                              </span>

                            </div>

                          )}


                        <div className="flex items-center gap-2 text-xs text-slate-500">

                          {form.online_event ? (
                            <Globe2
                              size={14}
                            />
                          ) : (
                            <MapPin
                              size={14}
                            />
                          )}

                          <span className="truncate">
                            {form.online_event
                              ? "Online event"
                              : form.venue_name ||
                                form.city ||
                                "Location not specified"}
                          </span>

                        </div>


                        <div className="flex items-center gap-2 text-xs text-slate-500">

                          <Users
                            size={14}
                          />

                          <span>
                            {form.registration_required
                              ? form.max_participants
                                ? `${form.max_participants} participant limit`
                                : "Registration required"
                              : "Registration not required"}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </section>


              {/* ============================================================
                  CREATION STATE
              ============================================================ */}

              <section className="
                rounded-[24px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              ">

                <div className="flex items-center gap-3">

                  <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-50
                    text-amber-600
                  ">
                    <ShieldCheck
                      size={18}
                    />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-900">
                      Creation state
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      This is what happens after save
                    </p>

                  </div>

                </div>


                <div className="mt-5 space-y-3">

                  <StateLine
                    label="Activity created"
                    done
                  />

                  <StateLine
                    label="Cover image stored"
                    done={
                      Boolean(
                        coverImageFile
                      )
                    }
                  />

                  <StateLine
                    label="Registration configured"
                    done={
                      form.registration_required
                    }
                  />

                  <StateLine
                    label="Public display"
                    value="OFF"
                    warning
                  />

                </div>

              </section>


              {/* ============================================================
                  QUICK INFO
              ============================================================ */}

              <InfoBox
                tone="blue"
                icon={Info}
              >
                <p className="font-bold">
                  Before saving
                </p>

                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>
                    Required fields must be completed.
                  </li>

                  <li>
                    Cover image must be 5 MB or less.
                  </li>

                  <li>
                    Registration dates are required
                    when registration is enabled.
                  </li>

                  <li>
                    New activities remain private
                    until explicitly published.
                  </li>
                </ul>
              </InfoBox>

            </aside>

          </div>


          {/* ================================================================
              ACTION BAR
          ================================================================ */}

          <div className="
            sticky
            bottom-0
            z-20
            mt-8
            rounded-[22px]
            border
            border-slate-200
            bg-white/95
            p-4
            shadow-[0_-10px_35px_rgba(15,23,42,0.08)]
            backdrop-blur
          ">

            <div className="
              flex
              flex-col
              justify-between
              gap-4
              sm:flex-row
              sm:items-center
            ">

              <div className="flex items-center gap-3">

                <div className="
                  hidden
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600
                  sm:flex
                ">
                  <Save
                    size={17}
                  />
                </div>

                <div>

                  <p className="text-sm font-bold text-slate-800">
                    Ready to create this activity?
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    It will remain hidden until an admin publishes it.
                  </p>

                </div>

              </div>


              <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    navigate(
                      "/admin/activities"
                    )
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <ArrowLeft
                    size={16}
                  />
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-indigo-600
                    px-6
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-indigo-200
                    transition
                    hover:bg-indigo-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Creating Activity...
                    </>
                  ) : (
                    <>
                      <Save
                        size={17}
                      />
                      Create Activity
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </form>

      </main>

    </div>
  );
}


/* ============================================================================
   STATE LINE
============================================================================ */

function StateLine({
  label,
  done = false,
  value = "",
  warning = false,
}) {
  return (
    <div className="flex items-center justify-between gap-3">

      <div className="flex min-w-0 items-center gap-2">

        <div
          className={`
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center
            rounded-full
            ${
              warning
                ? "bg-amber-100 text-amber-600"
                : done
                ? "bg-emerald-100 text-emerald-600"
                : "bg-slate-100 text-slate-400"
            }
          `}
        >
          {warning ? (
            <ShieldCheck size={13} />
          ) : done ? (
            <Check size={13} />
          ) : (
            <Clock3 size={13} />
          )}
        </div>

        <span className="truncate text-xs font-semibold text-slate-600">
          {label}
        </span>

      </div>

      {value && (
        <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-600">
          {value}
        </span>
      )}

    </div>
  );
}


/* ============================================================================
   USER ICON
============================================================================ */

function UserIcon({
  size = 18,
}) {
  return (
    <Users size={size} />
  );
}