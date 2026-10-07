import { useState } from "react";

import {
  FaUserFriends,
  FaLaptopCode,
  FaChalkboardTeacher,
  FaBullhorn,
  FaCheckCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaShieldAlt,
  FaArrowRight,
  FaHeart,
  FaSpinner,
  FaExclamationTriangle,
  FaCopy,
} from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

function Volunteer() {

  /*
  |--------------------------------------------------------------------------
  | Volunteer Opportunities
  |--------------------------------------------------------------------------
  */

  const roles = [
    {
      icon: <FaUserFriends />,
      title: "Student Verification",
      description:
        "Assist in verifying scholarship applications and supporting documents.",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Mentorship",
      description:
        "Guide students with academics, careers, and higher education opportunities.",
    },
    {
      icon: <FaLaptopCode />,
      title: "Technology Support",
      description:
        "Help with website development, graphic design, software, and technical initiatives.",
    },
    {
      icon: <FaBullhorn />,
      title: "Awareness & Outreach",
      description:
        "Spread awareness about our mission, scholarship programs, and community initiatives.",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Form
  |--------------------------------------------------------------------------
  */

  const initialForm = {
    full_name: "",
    mobile: "",
    email: "",
    city: "",
    area_of_interest: "",
    message: "",
  };

  const [formData, setFormData] =
    useState(initialForm);

  /*
  |--------------------------------------------------------------------------
  | UI State
  |--------------------------------------------------------------------------
  */

  const [submitting, setSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [duplicateMessage, setDuplicateMessage] =
    useState("");

  const [submittedVolunteer, setSubmittedVolunteer] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Handle Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    /*
    | Clear old errors while user edits
    */

    if (errorMessage) {
      setErrorMessage("");
    }

    if (duplicateMessage) {
      setDuplicateMessage("");
    }

  };

  /*
  |--------------------------------------------------------------------------
  | Submit Volunteer
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    /*
    | Prevent double submission
    */

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setDuplicateMessage("");

    try {

      /*
      |--------------------------------------------------------------------------
      | Prepare payload
      |--------------------------------------------------------------------------
      */

      const payload = {
        full_name:
          formData.full_name.trim(),

        mobile:
          formData.mobile.trim(),

        email:
          formData.email.trim().toLowerCase(),

        city:
          formData.city.trim(),

        area_of_interest:
          formData.area_of_interest,

        message:
          formData.message.trim(),
      };

      /*
      |--------------------------------------------------------------------------
      | PUBLIC CREATE API
      |--------------------------------------------------------------------------
      |
      | Backend automatically:
      |
      | - Sets application_source = PUBLIC
      | - Sets status = PENDING
      | - Generates volunteer code
      | - Checks duplicates
      | - Encrypts sensitive information
      |
      |--------------------------------------------------------------------------
      */

      const response = await fetch(
        `${API_BASE_URL}/api/volunteers`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(payload),
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Parse response safely
      |--------------------------------------------------------------------------
      */

      const result =
        await response.json();

      /*
      |--------------------------------------------------------------------------
      | Duplicate Volunteer
      |--------------------------------------------------------------------------
      */

      if (
        response.status === 409 ||
        result.code ===
          "VOLUNTEER_DUPLICATE"
      ) {

        const duplicateDetails =
          Array.isArray(
            result.duplicates
          )
            ? result.duplicates
                .map(
                  (item) =>
                    item.message
                )
                .filter(Boolean)
                .join(" ")
            : "";

        setDuplicateMessage(
          duplicateDetails ||
          result.message ||
          "A volunteer with these details already exists."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Validation / API Error
      |--------------------------------------------------------------------------
      */

      if (
        !response.ok ||
        !result.success
      ) {

        let message =
          result.message ||
          "Unable to submit your volunteer application.";

        /*
        | Handle validation arrays if backend returns them
        */

        if (
          Array.isArray(
            result.errors
          )
        ) {

          message =
            result.errors.join(
              " "
            );

        }

        throw new Error(
          message
        );

      }

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      const volunteer =
        result.data || {};

      setSubmittedVolunteer(
        volunteer
      );

      /*
      | Clear form after successful
      | backend creation.
      */

      setFormData(
        initialForm
      );

      /*
      | Scroll to success section
      */

      setTimeout(() => {

        document
          .getElementById(
            "volunteer-success"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

      }, 100);

    } catch (error) {

      console.error(
        "Volunteer submission error:",
        error
      );

      setErrorMessage(
        error.message ||
        "Unable to submit your volunteer application. Please try again."
      );

    } finally {

      setSubmitting(false);

    }

  };

  /*
  |--------------------------------------------------------------------------
  | Copy Volunteer Code
  |--------------------------------------------------------------------------
  */

  const copyVolunteerCode =
    async () => {

      if (
        !submittedVolunteer
          ?.volunteer_code
      ) {
        return;
      }

      try {

        await navigator.clipboard.writeText(
          submittedVolunteer.volunteer_code
        );

      } catch (error) {

        console.error(
          "Unable to copy volunteer code:",
          error
        );

      }

  };

  /*
  |--------------------------------------------------------------------------
  | Start Another Application
  |--------------------------------------------------------------------------
  */

  const startAnotherApplication =
    () => {

      setSubmittedVolunteer(null);
      setErrorMessage("");
      setDuplicateMessage("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    };

  return (

    <div className="bg-slate-50">

      {/* ================================================================
          HERO
      ================================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-24 text-white">

        <div className="absolute inset-0 opacity-10">

          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-yellow-400 blur-3xl" />

          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-400 blur-3xl" />

        </div>


        <div className="relative mx-auto max-w-5xl px-6 text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-sm font-bold text-yellow-300">

            <FaHeart />

            JOIN OUR MISSION

          </span>


          <h1 className="mt-8 text-5xl font-extrabold tracking-tight lg:text-6xl">

            Become a Volunteer

          </h1>


          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300 lg:text-xl">

            Give your time, knowledge, and compassion to help deserving
            students continue their education and build a brighter future.

          </p>


          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">

              <FaCheckCircle className="text-yellow-400" />

              Make an Impact

            </div>


            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">

              <FaUsersIcon />

              Serve Students

            </div>


            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">

              <FaHeart className="text-yellow-400" />

              Be Part of the Mission

            </div>

          </div>

        </div>

      </section>


      {/* ================================================================
          WHY VOLUNTEER
      ================================================================= */}

      <section className="bg-white py-24">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-600">

            Your Contribution Matters

          </span>


          <h2 className="mt-4 text-4xl font-bold text-slate-900 lg:text-5xl">

            Why Volunteer With Us?

          </h2>


          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600">

            Every volunteer plays an important role in helping students
            continue their education. Whether you mentor students,
            support technology, verify applications, or spread awareness,
            your contribution helps transform lives.

          </p>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <ImpactMiniCard
              icon={<FaHeart />}
              title="Create Impact"
              text="Your contribution directly supports students and educational opportunities."
            />

            <ImpactMiniCard
              icon={<FaUsersIcon />}
              title="Build Community"
              text="Work together with people who believe education can transform lives."
            />

            <ImpactMiniCard
              icon={<FaCheckCircle />}
              title="Make a Difference"
              text="Even a small contribution of time can create meaningful change."
            />

          </div>

        </div>

      </section>


      {/* ================================================================
          OPPORTUNITIES
      ================================================================= */}

      <section className="bg-slate-50 py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto mb-12 max-w-3xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-600">

              Volunteer Opportunities

            </span>


            <h2 className="mt-3 text-4xl font-bold text-slate-900">

              Find Your Way to Contribute

            </h2>

          </div>


          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">

            {roles.map(
              (role, index) => (

                <div
                  key={index}
                  className="
                    group
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-8
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-yellow-300
                    hover:shadow-2xl
                  "
                >

                  <div className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-yellow-50
                    text-3xl
                    text-yellow-500
                    transition
                    group-hover:bg-yellow-500
                    group-hover:text-white
                  ">

                    {role.icon}

                  </div>


                  <h3 className="mt-6 text-xl font-bold text-slate-900">

                    {role.title}

                  </h3>


                  <p className="mt-4 text-sm leading-7 text-slate-600">

                    {role.description}

                  </p>


                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-700">

                    Learn More

                    <FaArrowRight className="transition group-hover:translate-x-1" />

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ================================================================
          APPLICATION SECTION
      ================================================================= */}

      <section
        id="volunteer-form"
        className="bg-white py-24"
      >

        <div className="mx-auto max-w-6xl px-6">

          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">


            {/* LEFT INFORMATION */}

            <div className="lg:sticky lg:top-24">

              <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-600">

                Get Started

              </span>


              <h2 className="mt-4 text-4xl font-bold leading-tight text-slate-900">

                Start Your Volunteer Journey

              </h2>


              <p className="mt-5 text-base leading-8 text-slate-600">

                Tell us a little about yourself. Our team will review
                your interest and contact you on your registered mobile
                number or email.

              </p>


              <div className="mt-8 space-y-4">

                <InfoRow
                  icon={<FaClock />}
                  title="Quick Registration"
                  text="The initial form takes only a few minutes."
                />

                <InfoRow
                  icon={<FaPhoneAlt />}
                  title="Personal Follow-up"
                  text="Our team will contact you after reviewing your application."
                />

                <InfoRow
                  icon={<FaShieldAlt />}
                  title="Secure Information"
                  text="Your submitted information is securely processed by the foundation."
                />

              </div>


              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                <div className="flex gap-3">

                  <FaShieldAlt className="mt-1 shrink-0 text-blue-600" />

                  <p className="text-sm leading-6 text-blue-800">

                    Your initial application only asks for basic
                    information. Additional profile details may be
                    collected by an authorized foundation administrator
                    during the volunteer onboarding process.

                  </p>

                </div>

              </div>

            </div>


            {/* FORM / SUCCESS */}

            <div>

              {submittedVolunteer ? (

                <SuccessCard
                  volunteer={submittedVolunteer}
                  onCopy={copyVolunteerCode}
                  onNew={startAnotherApplication}
                />

              ) : (

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

                  {/* FORM HEADER */}

                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 to-blue-950 px-7 py-7 text-white sm:px-9">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500 text-xl text-slate-950">

                        <FaUserFriends />

                      </div>


                      <div>

                        <h3 className="text-xl font-bold">

                          Volunteer Interest Form

                        </h3>

                        <p className="mt-1 text-sm text-slate-300">

                          Submit your basic details to get started.

                        </p>

                      </div>

                    </div>

                  </div>


                  <div className="p-7 sm:p-9">

                    {/* ERROR */}

                    {errorMessage && (

                      <AlertBox
                        type="error"
                        message={errorMessage}
                      />

                    )}


                    {/* DUPLICATE */}

                    {duplicateMessage && (

                      <AlertBox
                        type="warning"
                        message={duplicateMessage}
                      />

                    )}


                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >

                      {/* NAME */}

                      <FormField
                        label="Full Name"
                        required
                      >

                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          autoComplete="name"
                          className={inputClass}
                        />

                      </FormField>


                      {/* MOBILE + EMAIL */}

                      <div className="grid gap-6 md:grid-cols-2">

                        <FormField
                          label="Mobile Number"
                          required
                        >

                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            required
                            pattern="[6-9]{1}[0-9]{9}"
                            maxLength={10}
                            autoComplete="tel"
                            className={inputClass}
                          />

                        </FormField>


                        <FormField
                          label="Email Address"
                          required
                        >

                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            className={inputClass}
                          />

                        </FormField>

                      </div>


                      {/* CITY */}

                      <FormField
                        label="City / District"
                      >

                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Example: Guntur"
                          autoComplete="address-level2"
                          className={inputClass}
                        />

                      </FormField>


                      {/* INTEREST */}

                      <FormField
                        label="Area of Interest"
                        required
                      >

                        <select
                          name="area_of_interest"
                          value={
                            formData.area_of_interest
                          }
                          onChange={handleChange}
                          required
                          className={inputClass}
                        >

                          <option value="">
                            Select an area of interest
                          </option>

                          <option value="Student Verification">
                            Student Verification
                          </option>

                          <option value="Mentorship">
                            Mentorship
                          </option>

                          <option value="Technology Support">
                            Technology Support
                          </option>

                          <option value="Awareness & Outreach">
                            Awareness & Outreach
                          </option>

                          <option value="General Volunteering">
                            General Volunteering
                          </option>

                        </select>

                      </FormField>


                      {/* MESSAGE */}

                      <FormField
                        label="Why would you like to volunteer?"
                      >

                        <textarea
                          rows="5"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us briefly how you would like to contribute..."
                          className={`${inputClass} resize-none`}
                        />

                      </FormField>


                      {/* INFORMATION */}

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                        <div className="flex gap-3">

                          <FaShieldAlt className="mt-0.5 shrink-0 text-blue-600" />

                          <p className="text-xs leading-5 text-slate-500">

                            By submitting this form, you are expressing
                            your interest in volunteering with Vidya
                            Jyothi Foundation. Your application will
                            initially be placed in{" "}

                            <strong className="text-slate-700">
                              Pending
                            </strong>{" "}

                            status and reviewed by our team.

                          </p>

                        </div>

                      </div>


                      {/* SUBMIT */}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="
                          group
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-3
                          rounded-2xl
                          bg-yellow-500
                          px-6
                          py-4
                          text-base
                          font-extrabold
                          text-slate-950
                          shadow-lg
                          shadow-yellow-200
                          transition-all
                          hover:-translate-y-0.5
                          hover:bg-yellow-400
                          hover:shadow-xl
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          disabled:hover:translate-y-0
                        "
                      >

                        {submitting ? (

                          <>
                            <FaSpinner className="animate-spin" />

                            Submitting Application...

                          </>

                        ) : (

                          <>
                            Submit Volunteer Application

                            <FaArrowRight className="transition group-hover:translate-x-1" />

                          </>

                        )}

                      </button>


                      <p className="text-center text-xs text-slate-400">

                        Your information is securely processed by
                        Vidya Jyothi Foundation.

                      </p>

                    </form>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

    </div>

  );
}


/* ==========================================================================
   SUCCESS CARD
========================================================================== */

function SuccessCard({
  volunteer,
  onCopy,
  onNew,
}) {

  return (

    <div
      id="volunteer-success"
      className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-2xl shadow-emerald-100"
    >

      {/* SUCCESS HEADER */}

      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 px-7 py-10 text-center text-white sm:px-10">

        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

        <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/10" />


        <div className="relative">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xl">

            <FaCheckCircle size={46} />

          </div>


          <h2 className="mt-6 text-3xl font-extrabold">

            Application Received!

          </h2>


          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-emerald-50">

            Thank you for your interest in joining Vidya Jyothi
            Foundation. Your volunteer application has been successfully
            registered.

          </p>

        </div>

      </div>


      {/* DETAILS */}

      <div className="p-7 sm:p-9">

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">

            Your Volunteer ID

          </p>


          <div className="mt-3 flex items-center justify-center gap-3">

            <span className="font-mono text-xl font-extrabold tracking-wide text-blue-700 sm:text-2xl">

              {volunteer.volunteer_code ||
                "Generated Successfully"}

            </span>


            {volunteer.volunteer_code && (

              <button
                type="button"
                onClick={onCopy}
                title="Copy volunteer ID"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >

                <FaCopy size={14} />

              </button>

            )}

          </div>

        </div>


        {/* STATUS */}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          <StatusBox
            label="Application Status"
            value={
              volunteer.status ||
              "PENDING"
            }
            className="border-amber-200 bg-amber-50 text-amber-700"
          />

          <StatusBox
            label="Application Source"
            value={
              volunteer.application_source ||
              "PUBLIC"
            }
            className="border-blue-200 bg-blue-50 text-blue-700"
          />

        </div>


        {/* NEXT STEP */}

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

              <FaPhoneAlt />

            </div>


            <div>

              <h3 className="font-bold text-blue-900">

                What happens next?

              </h3>


              <p className="mt-2 text-sm leading-6 text-blue-800">

                Our volunteer coordinator will review your application
                and contact you on your registered mobile number or
                email. During this conversation, we may collect
                additional information needed to complete your
                volunteer profile.

              </p>

            </div>

          </div>

        </div>


        {/* TIMELINE */}

        <div className="mt-7">

          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">

            Volunteer Onboarding

          </h3>


          <div className="mt-4 space-y-4">

            <TimelineItem
              number="1"
              title="Application Submitted"
              description="Your basic volunteer details have been received."
              active
            />

            <TimelineItem
              number="2"
              title="Team Review"
              description="Our team will contact you and review your interest."
            />

            <TimelineItem
              number="3"
              title="Profile Completion"
              description="Additional volunteer information will be collected."
            />

            <TimelineItem
              number="4"
              title="Approval"
              description="After verification, the foundation can approve your volunteer profile."
            />

          </div>

        </div>


        {/* ACTION */}

        <button
          type="button"
          onClick={onNew}
          className="
            mt-8
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-5
            py-3.5
            text-sm
            font-bold
            text-slate-700
            transition
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-700
          "
        >

          Submit Another Volunteer Application

          <FaArrowRight />

        </button>

      </div>

    </div>

  );
}


/* ==========================================================================
   STATUS BOX
========================================================================== */

function StatusBox({
  label,
  value,
  className,
}) {

  return (

    <div
      className={`rounded-2xl border p-4 ${className}`}
    >

      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">

        {label}

      </p>


      <p className="mt-1 text-sm font-extrabold">

        {value}

      </p>

    </div>

  );
}


/* ==========================================================================
   TIMELINE ITEM
========================================================================== */

function TimelineItem({
  number,
  title,
  description,
  active = false,
}) {

  return (

    <div className="flex gap-4">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
          active
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >

        {active ? (
          <FaCheckCircle />
        ) : (
          number
        )}

      </div>


      <div>

        <h4 className="text-sm font-bold text-slate-800">

          {title}

        </h4>


        <p className="mt-1 text-xs leading-5 text-slate-500">

          {description}

        </p>

      </div>

    </div>

  );
}


/* ==========================================================================
   FORM FIELD
========================================================================== */

function FormField({
  label,
  required,
  children,
}) {

  return (

    <div>

      <label className="mb-2 block text-sm font-bold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      {children}

    </div>

  );
}


/* ==========================================================================
   INFO ROW
========================================================================== */

function InfoRow({
  icon,
  title,
  text,
}) {

  return (

    <div className="flex gap-4">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">

        {icon}

      </div>


      <div>

        <h3 className="font-bold text-slate-800">

          {title}

        </h3>


        <p className="mt-1 text-sm leading-6 text-slate-500">

          {text}

        </p>

      </div>

    </div>

  );
}


/* ==========================================================================
   IMPACT MINI CARD
========================================================================== */

function ImpactMiniCard({
  icon,
  title,
  text,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">

        {icon}

      </div>


      <h3 className="mt-4 font-bold text-slate-900">

        {title}

      </h3>


      <p className="mt-2 text-sm leading-6 text-slate-500">

        {text}

      </p>

    </div>

  );
}


/* ==========================================================================
   ALERT
========================================================================== */

function AlertBox({
  type,
  message,
}) {

  const isWarning =
    type === "warning";

  return (

    <div
      className={`mb-6 rounded-2xl border p-4 ${
        isWarning
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >

      <div className="flex gap-3">

        <FaExclamationTriangle className="mt-0.5 shrink-0" />

        <p className="text-sm font-medium leading-6">

          {message}

        </p>

      </div>

    </div>

  );
}


/* ==========================================================================
   INPUT STYLE
========================================================================== */

const inputClass = `
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3.5
  text-sm
  font-medium
  text-slate-700
  outline-none
  transition-all
  placeholder:text-slate-300
  focus:border-blue-500
  focus:ring-4
  focus:ring-blue-50
`;


/* ==========================================================================
   SMALL ICON WRAPPER
========================================================================== */

function FaUsersIcon() {
  return <FaUserFriends />;
}


export default Volunteer;