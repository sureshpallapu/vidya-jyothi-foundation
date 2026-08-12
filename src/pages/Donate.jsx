import { useState } from "react";
import Swal from "sweetalert2";

import {
  FaBook,
  FaGraduationCap,
  FaLaptop,
  FaHeart,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaUniversity,
  FaMobileAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaCreditCard,
  FaChevronDown,
  FaHandHoldingHeart,
  FaUser,
  FaTicketAlt,
  FaQuoteLeft,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

import PageTitle from "../components/PageTitle";

import {
  createDonationOrder,
  verifyDonationPayment,
} from "../api/publicDonationApi";

/*
|--------------------------------------------------------------------------
| Design System — "Ledger & Ticket"
|--------------------------------------------------------------------------
|
| The identity is built from two artifacts of a school: the ruled
| register/ledger where every contribution is entered as a line, and
| the admission/donation ticket handed back as proof. Chalkboard ink,
| ruled-paper cream and marigold (a festival & classroom-marker colour
| across Andhra Pradesh) replace a generic dark-teal SaaS palette.
| Fraunces (an editorial serif) carries headlines, Caveat stands in for
| a teacher's handwritten mark, Inter carries body copy, and IBM Plex
| Mono renders every reference / receipt code like a ledger entry.
|
| For production, move the @import below into your global stylesheet
| or index.html <head> — it's inlined here only so this file previews
| correctly on its own.
|--------------------------------------------------------------------------
*/

const INK = "#1C2431";
const PAPER = "#F3EEDF";
const PAPER_CARD = "#FBF8EF";
const SAFFRON = "#E2963A";
const BRICK = "#A63D2C";
const MOSS = "#5B7553";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
    .font-hand    { font-family: 'Caveat', cursive; }
    .font-mono-vjf{ font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    .font-body    { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

    .chalk-dust{
      background-image:
        radial-gradient(circle at 12% 18%, rgba(243,239,226,0.06), transparent 40%),
        radial-gradient(circle at 88% 65%, rgba(226,150,58,0.10), transparent 45%),
        radial-gradient(circle at 50% 95%, rgba(243,239,226,0.05), transparent 40%);
    }

    .ledger-rows{
      background-image: repeating-linear-gradient(
        to bottom,
        transparent,
        transparent 30px,
        rgba(36,31,23,0.07) 31px
      );
    }

    .torn-top{
      clip-path: polygon(
        0% 10px, 4% 0, 8% 10px, 12% 0, 16% 10px, 20% 0, 24% 10px, 28% 0,
        32% 10px, 36% 0, 40% 10px, 44% 0, 48% 10px, 52% 0, 56% 10px, 60% 0,
        64% 10px, 68% 0, 72% 10px, 76% 0, 80% 10px, 84% 0, 88% 10px, 92% 0,
        96% 10px, 100% 0, 100% 100%, 0% 100%
      );
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .reveal { animation: fadeUp 0.7s ease both; }

    @media (prefers-reduced-motion: reduce) {
      .reveal { animation: none; }
    }
  `}</style>
);

/* A dashed "perforation" with punched circular notches — the recurring
   ticket motif. `bg` should match whatever sits BEHIND the card so the
   notches read as holes rather than dots. */
const TicketDivider = ({ bg = PAPER_CARD, className = "" }) => (
  <div className={`relative -mx-6 sm:-mx-8 ${className}`}>
    <div className="border-t-2 border-dashed border-black/15" />
    <span
      className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
      style={{ background: bg }}
    />
    <span
      className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
      style={{ background: bg }}
    />
  </div>
);

/* Hand-drawn underline swept beneath an accent word. */
const Squiggle = ({ className = "", color = SAFFRON }) => (
  <svg
    viewBox="0 0 200 12"
    preserveAspectRatio="none"
    className={`pointer-events-none absolute left-0 w-full ${className}`}
  >
    <path
      d="M2 8 Q 25 2, 50 7 T 100 6 T 150 7 T 198 5"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
    />
  </svg>
);

const SectionEyebrow = ({ children, dark = false }) => (
  <span
    className={`font-mono-vjf text-xs font-semibold uppercase tracking-[0.25em] ${
      dark ? "text-[#E2963A]" : "text-[#A63D2C]"
    }`}
  >
    {children}
  </span>
);

/* A ledger row for a reference code that can be copied in one tap —
   used throughout the success receipt for donation/receipt/transaction
   IDs, which donors otherwise have to retype by hand. */
const CopyField = ({ label, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can fail silently (unsupported browser, no
      // permission) — the value is still visible to copy manually.
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-[9px]">
      <span className="font-mono-vjf text-xs uppercase tracking-wide text-[#6E6353]">
        {label}
      </span>

      <button
        type="button"
        onClick={handleCopy}
        disabled={!value}
        className="group flex max-w-[220px] items-center gap-2 text-right font-mono-vjf text-sm font-semibold text-[#241F17] transition hover:text-[#A63D2C] disabled:cursor-default disabled:hover:text-[#241F17]"
      >
        <span className="break-all">{value || "—"}</span>
        {value && (
          copied ? (
            <FaCheck className="shrink-0 text-xs text-[#5B7553]" />
          ) : (
            <FaCopy className="shrink-0 text-xs opacity-0 transition group-hover:opacity-100" />
          )
        )}
      </button>
    </div>
  );
};

function Donate() {

  /*
  |--------------------------------------------------------------------------
  | Donation Purposes
  |--------------------------------------------------------------------------
  |
  | IDs match your existing donation_type master data.
  |
  | 1 - General Donation
  | 2 - Scholarship
  | 3 - Education Sponsorship
  | 4 - Corpus Fund
  | 5 - Building Fund
  | 8 - Books & Stationery
  |
  */

  const donationPlans = [
    {
      id: 8,
      amount: 500,
      title: "Books & Stationery",
      description:
        "Help provide notebooks, textbooks and essential study materials.",
      icon: <FaBook />,
    },
    {
      id: 2,
      amount: 2000,
      title: "Scholarship Support",
      description:
        "Help deserving students continue their education without financial barriers.",
      icon: <FaGraduationCap />,
    },
    {
      id: 3,
      amount: 5000,
      title: "Education Sponsorship",
      description:
        "Support tuition, academic expenses and a student's educational journey.",
      icon: <FaLaptop />,
    },
    {
      id: 4,
      amount: 10000,
      title: "Corpus Fund",
      description:
        "Strengthen the Foundation's long-term ability to support students.",
      icon: <FaHeart />,
    },
  ];

  const donationTypes = [
    { id: 1, label: "General Donation" },
    { id: 2, label: "Scholarship" },
    { id: 3, label: "Education Sponsorship" },
    { id: 4, label: "Corpus Fund" },
    { id: 5, label: "Building Fund" },
    { id: 6, label: "Medical Assistance" },
    { id: 7, label: "Annadanam" },
    { id: 8, label: "Books & Stationery" },
    { id: 9, label: "Emergency Relief" },
    { id: 10, label: "Other" },
  ];

  /* Data for sections that would otherwise be repeated JSX blocks —
     same content, driven from arrays so the markup stays readable. */

  const impactAreas = [
    { icon: "📚", title: "Learning Materials", text: "Books, notebooks and essential academic resources." },
    { icon: "🎓", title: "Scholarships", text: "Financial assistance for deserving students." },
    { icon: "💻", title: "Digital Learning", text: "Technology and digital learning opportunities." },
    { icon: "❤️", title: "Student Welfare", text: "Support that helps students stay focused on education." },
  ];

  const transparencyPoints = [
    "Every donation is properly recorded.",
    "Funds are used for approved Foundation initiatives.",
    "Donation records are maintained for accountability.",
    "Scholarship beneficiaries are documented.",
    "Donor information is handled responsibly.",
    "Annual reports can be published for transparency.",
  ];

  const bankDetails = [
    { label: "Account Name", value: "Vidya Jyothi Foundation" },
    { label: "Account Number", value: "XXXXXXXXXXXXXXXX" },
    { label: "Bank Name", value: "State Bank of India" },
    { label: "IFSC Code", value: "SBIN0000000" },
    { label: "Branch", value: "Guntur Branch", full: true },
  ];

  const faqItems = [
    {
      q: "Will I receive a donation acknowledgement?",
      a: "Yes. Once the donation has been successfully verified and recorded, the Foundation can generate the appropriate acknowledgement or receipt.",
    },
    {
      q: "How will my donation be used?",
      a: "Contributions are intended to support scholarships, educational resources, student welfare and other approved initiatives of the Foundation.",
    },
    {
      q: "Can I choose where my donation goes?",
      a: "Yes. The online form provides donation purposes such as scholarships, education sponsorship, corpus fund and books & stationery.",
    },
  ];

  const contactChannels = [
    { icon: <FaPhoneAlt />, title: "Call Us", value: "+91 XXXXX XXXXX", href: "tel:+91XXXXXXXXXX" },
    { icon: <FaEnvelope />, title: "Email Us", value: "info@vidyajyothi.org", href: "mailto:info@vidyajyothi.org" },
    { icon: <FaMobileAlt />, title: "WhatsApp", value: "Chat with our team", href: "https://wa.me/91XXXXXXXXXX" },
  ];

  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",

    donation_type_id: 1,

    amount: "",

    pan_number: "",

    address_line1: "",
    address_line2: "",

    city: "",
    district: "",
    state: "Andhra Pradesh",

    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Input Handler
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Select Donation Plan
  |--------------------------------------------------------------------------
  */

  const selectDonationPlan = (plan) => {
    setForm((previous) => ({
      ...previous,
      donation_type_id: plan.id,
      amount: String(plan.amount),
    }));

    document
      .getElementById("donation-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /*
  |--------------------------------------------------------------------------
  | Load Razorpay
  |--------------------------------------------------------------------------
  */

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.onload = () => resolve(true);
        existingScript.onerror = () => resolve(false);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Open Razorpay Checkout
  |--------------------------------------------------------------------------
  */

  const openRazorpayCheckout = (order) => {
    if (!window.Razorpay) {
      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Payment Unavailable",
        text: "Secure payment could not be loaded. Please refresh the page and try again.",
      });

      return;
    }

    const selectedType = donationTypes.find(
      (type) => Number(type.id) === Number(form.donation_type_id)
    );

    const options = {

      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      order_id: order.order_id,

      name: "Vidya Jyothi Foundation",

      description:
        selectedType?.label || "Donation to Vidya Jyothi Foundation",

      image: "/logo.png",

      prefill: {
        name: form.full_name,
        email: form.email,
        contact: `+91${form.mobile}`,
      },

      notes: {
        donation_purpose: selectedType?.label || "Donation",
        donor_email: form.email,
      },

      theme: {
        color: SAFFRON,
        backdrop_color: "rgba(28, 36, 49, 0.82)",
      },

      modal: {
        confirm_close: true,
        escape: true,
        backdropclose: false,
        animation: true,
      },

      retry: {
        enabled: true,
        max_count: 3,
      },

      /*
      |--------------------------------------------------------------------------
      | Success Callback
      |--------------------------------------------------------------------------
      |
      | Sends the Razorpay response + donor details to our backend for
      | server-side signature verification, then normalizes whatever
      | shape the backend returns (new donation vs. already-RECEIVED)
      | into one consistent `result` object for the success screen.
      |
      */

      handler: async function (response) {

        console.log("========== RAZORPAY PAYMENT RESPONSE ==========");
        console.log(response);

        try {

          const verificationResponse = await verifyDonationPayment({

            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,

            full_name: form.full_name,
            email: form.email,
            mobile: form.mobile,

            donation_type_id: Number(form.donation_type_id),
            amount: Number(form.amount),

            pan_number: form.pan_number,

            address_line1: form.address_line1,
            address_line2: form.address_line2,

            city: form.city,
            district: form.district,
            state: form.state,
            pincode: form.pincode,

          });

          const responseData = verificationResponse?.data?.data;

          console.log("========== DONATION VERIFICATION RESPONSE ==========");
          console.log(JSON.stringify(responseData, null, 2));

          /*
          |--------------------------------------------------------------------------
          | Normalize Backend Response
          |--------------------------------------------------------------------------
          |
          | Backend may return donation/payment/receipt objects in
          | slightly different structures depending on whether the
          | donation was newly processed or was already marked RECEIVED.
          |
          */

          const normalizedDonation = {

            donation_code:
              responseData?.donation?.donation_code ||
              responseData?.donation_code ||
              responseData?.donation?.code ||
              "",

            amount: Number(
              responseData?.donation?.amount ??
              responseData?.amount ??
              form.amount ??
              0
            ),

            currency:
              responseData?.donation?.currency ||
              responseData?.currency ||
              "INR",

            transaction_id:
              responseData?.donation?.transaction_id ||
              responseData?.transaction_id ||
              responseData?.payment?.id ||
              response.razorpay_payment_id ||
              "",

            order_id:
              responseData?.donation?.order_id ||
              responseData?.order_id ||
              response.razorpay_order_id,

            status:
              responseData?.donation?.status ||
              responseData?.status ||
              "RECEIVED",

          };

          const normalizedPayment = {

            id:
              responseData?.payment?.id ||
              responseData?.payment_id ||
              response.razorpay_payment_id,

            method:
              responseData?.payment?.method ||
              responseData?.payment_method ||
              "Online Payment",

          };

          const normalizedDonor = {

            email: responseData?.donor?.email || responseData?.email || form.email,

            full_name:
              responseData?.donor?.full_name ||
              responseData?.full_name ||
              form.full_name,

          };

          const normalizedReceipt = {
            receipt_code:
              responseData?.receipt?.receipt_code ||
              responseData?.receipt_code ||
              "",
          };

          const result = {
            donation: normalizedDonation,
            payment: normalizedPayment,
            donor: normalizedDonor,
            receipt: normalizedReceipt,
          };

          console.log("========== NORMALIZED DONATION ==========");
          console.log(JSON.stringify(result, null, 2));

          setLoading(false);
          setDonationSuccess(result);

        } catch (error) {

          console.error("❌ Payment verification error:", error);

          setLoading(false);

          Swal.fire({
            icon: "error",
            title: "Payment Received, But Verification Failed",
            text:
              error.response?.data?.message ||
              "We could not complete the donation registration. Please contact the Foundation with your Razorpay payment ID.",
            confirmButtonColor: SAFFRON,
          });

        }

      },

    };

    const razorpay = new window.Razorpay(options);

    /*
    |--------------------------------------------------------------------------
    | Payment Failed
    |--------------------------------------------------------------------------
    */

    razorpay.on("payment.failed", function (response) {
      console.error("Razorpay payment failed:", response);

      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text:
          response?.error?.description ||
          "Your payment could not be completed.",
        confirmButtonColor: SAFFRON,
      });
    });

    /*
    |--------------------------------------------------------------------------
    | Modal Closed
    |--------------------------------------------------------------------------
    */

    razorpay.on("modal.closed", function () {
      setLoading(false);
    });

    /*
    |--------------------------------------------------------------------------
    | Open Checkout
    |--------------------------------------------------------------------------
    */

    razorpay.open();

  };

  /*
  |--------------------------------------------------------------------------
  | Submit Donation
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.full_name.trim() || !form.email.trim() || !form.mobile.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Complete Your Details",
        text: "Please enter your name, email and mobile number.",
        confirmButtonColor: SAFFRON,
      });

      return;
    }

    const amount = Number(form.amount);

    if (!amount || amount < 1) {
      Swal.fire({
        icon: "warning",
        title: "Enter Donation Amount",
        text: "Please enter a valid donation amount.",
        confirmButtonColor: SAFFRON,
      });

      return;
    }

    try {
      setLoading(true);

      /*
      |--------------------------------------------------------------------------
      | Load Razorpay
      |--------------------------------------------------------------------------
      */

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error("Unable to load Razorpay Checkout.");
      }

      /*
      |--------------------------------------------------------------------------
      | Create Order On Our Server
      |--------------------------------------------------------------------------
      */

      const response = await createDonationOrder({
        ...form,
        amount,
        donation_type_id: Number(form.donation_type_id),
      });

      const order = response.data.data;

      /*
      |--------------------------------------------------------------------------
      | Open Razorpay
      |--------------------------------------------------------------------------
      */

      openRazorpayCheckout(order);

    } catch (error) {

      console.error("Donation payment error:", error);

      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Unable to Start Payment",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong while starting the payment.",
        confirmButtonColor: SAFFRON,
      });

    }

  };

  /*
  |--------------------------------------------------------------------------
  | Format Amount
  |--------------------------------------------------------------------------
  */

  const formatAmount = (amount) => new Intl.NumberFormat("en-IN").format(amount);

  const selectedType = donationTypes.find(
    (type) => Number(type.id) === Number(form.donation_type_id)
  );

  /* ============================================================
     SUCCESS SCREEN — rendered as a torn-off admission ticket / receipt
  ============================================================= */

  if (donationSuccess) {

    const receiptFields = [
      { label: "Donation ID", value: donationSuccess?.donation?.donation_code },
      ...(donationSuccess?.receipt?.receipt_code
        ? [{ label: "Receipt", value: donationSuccess.receipt.receipt_code }]
        : []),
      { label: "Transaction ID", value: donationSuccess?.donation?.transaction_id },
      { label: "Order ID", value: donationSuccess?.donation?.order_id },
    ];

    return (
      <div className="font-body min-h-screen bg-[#1C2431] text-[#F3EEDF]">

        <GlobalStyle />
        <PageTitle title="Donation Successful" />

        <div className="chalk-dust relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">

          <div className="reveal relative z-10 w-full max-w-xl">

            <div className="torn-top overflow-hidden rounded-b-[1.75rem] bg-[#FBF8EF] pt-6 text-[#241F17] shadow-2xl">

              {/* Stamp header */}
              <div className="px-7 pb-8 pt-6 text-center sm:px-10">

                <div className="mx-auto flex h-20 w-20 -rotate-6 items-center justify-center rounded-full border-[3px] border-[#5B7553] text-[#5B7553]">
                  <FaCheckCircle className="text-3xl" />
                </div>

                <p className="font-mono-vjf mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#5B7553]">
                  Payment Received
                </p>

                <h1 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                  Thank you for your donation
                </h1>

                <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-[#6E6353]">
                  Your contribution has been received and entered into
                  Vidya Jyothi Foundation's donor register.
                </p>

              </div>

              <TicketDivider bg="#FBF8EF" />

              {/* Amount stub */}
              <div className="px-7 py-7 text-center sm:px-10">
                <p className="font-mono-vjf text-xs uppercase tracking-[0.25em] text-[#6E6353]">
                  Donation Amount
                </p>
                <p className="font-display mt-2 text-5xl font-bold text-[#A63D2C]">
                  ₹{Number(donationSuccess?.donation?.amount || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <TicketDivider bg="#FBF8EF" />

              {/* Ledger-style details */}
              <div className="px-7 py-7 sm:px-10">

                <div className="ledger-rows space-y-0 rounded-xl">

                  {receiptFields.map((field) => (
                    <CopyField key={field.label} label={field.label} value={field.value} />
                  ))}

                  <div className="flex items-center justify-between gap-4 py-[9px]">
                    <span className="font-mono-vjf text-xs uppercase tracking-wide text-[#6E6353]">
                      Payment Method
                    </span>
                    <span className="font-semibold capitalize">
                      {donationSuccess?.payment?.method || "Online Payment"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-[9px]">
                    <span className="font-mono-vjf text-xs uppercase tracking-wide text-[#6E6353]">
                      Status
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#5B7553]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#5B7553]">
                      <FaCheckCircle />
                      {donationSuccess?.donation?.status || "RECEIVED"}
                    </span>
                  </div>

                </div>

                {/* Email confirmation */}
                <div className="mt-6 flex gap-4 rounded-2xl border border-[#5B7553]/20 bg-[#5B7553]/[0.07] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5B7553]/10 text-[#5B7553]">
                    <FaEnvelope />
                  </div>
                  <p className="text-sm leading-6 text-[#4A4232]">
                    Your donation receipt has been sent as a PDF to{" "}
                    <span className="font-semibold text-[#A63D2C]">
                      {donationSuccess?.donor?.email || form.email}
                    </span>
                    .
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDonationSuccess(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#1C2431] px-6 py-4 font-semibold text-[#F3EEDF] shadow-lg transition hover:bg-[#141B24]"
                >
                  Return to Foundation
                  <FaArrowRight />
                </button>

              </div>

            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#B9AF9C]">
              <FaLock />
              Secure payment verified by Razorpay
            </div>

          </div>

        </div>

      </div>
    );
  }

  /* ============================================================
     MAIN PAGE
  ============================================================= */

  return (

    <div className="font-body min-h-screen bg-[#F3EEDF]">

      <GlobalStyle />
      <PageTitle title="Donate" />


      {/* ================================================================
          HERO
      ================================================================= */}

      <section className="chalk-dust relative overflow-hidden bg-[#1C2431] text-[#F3EEDF]">

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">

            <div>

              <div
                className="reveal inline-flex items-center gap-2 rounded-full border border-[#E2963A]/30 bg-[#E2963A]/10 px-5 py-2 font-mono-vjf text-xs font-semibold uppercase tracking-[0.2em] text-[#E2963A]"
              >
                <FaHandHoldingHeart />
                Vidya Jyothi Foundation &middot; Guntur
              </div>

              <h1
                className="reveal font-display mt-8 max-w-xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl"
                style={{ animationDelay: "80ms" }}
              >
                Every rupee is a{" "}
                <span className="relative inline-block">
                  page turned
                  <Squiggle className="-bottom-2 h-3" />
                </span>
                {" "}for a student.
              </h1>

              <p
                className="reveal mt-7 max-w-lg text-lg leading-8 text-[#C7C0AC]"
                style={{ animationDelay: "160ms" }}
              >
                Support deserving students with scholarships,
                educational resources, sponsorships and long-term
                opportunities — recorded, receipted, and put to work.
              </p>

              <div
                className="reveal mt-10 flex flex-wrap gap-4"
                style={{ animationDelay: "240ms" }}
              >

                <a
                  href="#donation-form"
                  className="inline-flex items-center gap-3 rounded-xl bg-[#E2963A] px-7 py-4 font-semibold text-[#1C2431] shadow-lg shadow-[#E2963A]/20 transition hover:-translate-y-0.5 hover:bg-[#efab55]"
                >
                  Start Your Donation
                  <FaArrowRight />
                </a>

                <a
                  href="#impact"
                  className="inline-flex items-center gap-3 rounded-xl border border-[#F3EEDF]/20 px-7 py-4 font-semibold text-[#F3EEDF] transition hover:bg-[#F3EEDF]/10"
                >
                  See Your Impact
                </a>

              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono-vjf text-xs text-[#9AA1AE]">
                <span className="flex items-center gap-2"><FaCheckCircle className="text-[#E2963A]" /> Secure online payment</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-[#E2963A]" /> Digital acknowledgement</span>
                <span className="flex items-center gap-2"><FaCheckCircle className="text-[#E2963A]" /> Transparent records</span>
              </div>

            </div>


            {/* Hero admission-ticket preview */}

            <div className="reveal relative" style={{ animationDelay: "200ms" }}>

              <div className="rounded-[1.5rem] bg-[#FBF8EF] pt-6 text-[#241F17] shadow-2xl">

                <div className="flex items-center justify-between px-7">
                  <span className="font-mono-vjf text-[11px] uppercase tracking-[0.2em] text-[#6E6353]">Donation Ticket</span>
                  <FaTicketAlt className="text-[#A63D2C]" />
                </div>

                <h2 className="font-display px-7 pt-3 text-2xl font-bold">
                  Give with purpose
                </h2>

                <TicketDivider bg="#FBF8EF" className="mt-5" />

                <div className="px-7 py-5">

                  <div className="space-y-2">

                    {donationPlans.slice(0, 3).map((plan) => (

                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => selectDonationPlan(plan)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#241F17]/10 px-4 py-3 text-left transition hover:border-[#A63D2C]/40 hover:bg-[#A63D2C]/5"
                      >
                        <span>
                          <span className="block text-sm font-semibold">{plan.title}</span>
                          <span className="text-xs text-[#6E6353]">{plan.description.substring(0, 40)}&hellip;</span>
                        </span>

                        <span className="whitespace-nowrap font-mono-vjf text-sm font-semibold text-[#A63D2C]">
                          ₹{formatAmount(plan.amount)}
                        </span>
                      </button>

                    ))}

                  </div>

                  <a
                    href="#donation-form"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C2431] py-3.5 font-semibold text-[#F3EEDF] transition hover:bg-[#141B24]"
                  >
                    Donate Now
                    <FaArrowRight />
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================================
          IMPACT
      ================================================================= */}

      <section id="impact" className="bg-[#F3EEDF] py-24">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Why your donation matters</SectionEyebrow>
            <h2 className="font-display mt-4 text-4xl font-bold tracking-tight text-[#241F17] sm:text-5xl">
              Small contributions, entered one line at a time,
              create lasting opportunities.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#6E6353]">
              Your support can help students access the resources,
              financial assistance and educational opportunities
              they need to keep moving forward.
            </p>
          </div>


          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {impactAreas.map((item, index) => (

              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-[#241F17]/10 bg-[#FBF8EF] p-7 pt-9 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="absolute left-0 top-0 h-1.5 w-full bg-[#E2963A]" />
                <span className="font-mono-vjf absolute right-5 top-5 text-xs text-[#241F17]/25">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="text-4xl">{item.icon}</div>
                <h3 className="font-display mt-5 text-xl font-bold text-[#241F17]">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#6E6353]">{item.text}</p>
              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================================================================
          DONATION PLANS
      ================================================================= */}

      <section className="bg-[#F3EEDF] pb-24">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-6 border-t border-[#241F17]/10 pt-16 md:flex-row md:items-end">

            <div>
              <SectionEyebrow>Choose your impact</SectionEyebrow>
              <h2 className="font-display mt-3 text-4xl font-bold text-[#241F17] sm:text-5xl">
                Give with a purpose
              </h2>
            </div>

            <p className="max-w-xl text-[#6E6353]">
              Choose a suggested contribution or enter any
              amount that feels right for you.
            </p>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {donationPlans.map((plan) => (

              <button
                key={plan.id}
                type="button"
                onClick={() => selectDonationPlan(plan)}
                className="group flex flex-col rounded-2xl bg-[#FBF8EF] pt-6 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                <div className="flex items-center justify-between px-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A63D2C]/10 text-xl text-[#A63D2C] transition group-hover:bg-[#A63D2C] group-hover:text-white">
                    {plan.icon}
                  </div>
                  <FaTicketAlt className="text-[#241F17]/15" />
                </div>

                <p className="font-display px-6 pt-6 text-3xl font-bold text-[#241F17]">
                  ₹{formatAmount(plan.amount)}
                </p>

                <h3 className="font-display px-6 pt-2 text-lg font-bold text-[#241F17]">
                  {plan.title}
                </h3>

                <p className="min-h-[68px] px-6 pt-2 leading-6 text-[#6E6353]">
                  {plan.description}
                </p>

                <TicketDivider bg="#FBF8EF" className="mt-5" />

                <div className="flex items-center justify-between px-6 py-4 font-mono-vjf text-xs font-semibold uppercase tracking-wide text-[#A63D2C]">
                  Choose this ticket
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </div>

              </button>

            ))}

          </div>

        </div>

      </section>


      {/* ================================================================
          MAIN DONATION FORM
      ================================================================= */}

      <section id="donation-form" className="chalk-dust scroll-mt-20 bg-[#1C2431] py-24">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center text-[#F3EEDF]">
            <SectionEyebrow dark>Secure online donation</SectionEyebrow>
            <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
              Make your contribution
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#B9AF9C]">
              Your details help us create an accurate donor record
              and provide your donation acknowledgement.
            </p>
          </div>


          <form
            id="donation-form"
            onSubmit={handleSubmit}
            className="mt-14 grid gap-6 lg:grid-cols-[1fr_400px]"
          >

            {/* ==========================================================
                DONOR DETAILS
            =========================================================== */}

            <div className="rounded-[1.75rem] bg-[#FBF8EF] p-7 shadow-2xl sm:p-10">

              <div className="flex items-center gap-4 border-b border-[#241F17]/10 pb-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A63D2C]/10 text-[#A63D2C]">
                  <FaUser />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#241F17]">Your details</h3>
                  <p className="font-mono-vjf text-xs uppercase tracking-wide text-[#6E6353]">Required for donation processing</p>
                </div>
              </div>


              <div className="mt-8 grid gap-5 md:grid-cols-2">

                {/* Full Name */}

                <div>
                  <label className="text-sm font-semibold text-[#241F17]">
                    Full Name<span className="ml-1 text-[#A63D2C]">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="mt-2 w-full rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                  />
                </div>


                {/* Email */}

                <div>
                  <label className="text-sm font-semibold text-[#241F17]">
                    Email Address<span className="ml-1 text-[#A63D2C]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                  />
                </div>


                {/* Mobile */}

                <div>
                  <label className="text-sm font-semibold text-[#241F17]">
                    Mobile Number<span className="ml-1 text-[#A63D2C]">*</span>
                  </label>
                  <div className="mt-2 flex">
                    <span className="flex items-center rounded-l-xl border border-r-0 border-[#241F17]/15 bg-[#F3EEDF] px-4 font-mono-vjf text-sm font-semibold text-[#6E6353]">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="9876543210"
                      className="w-full rounded-r-xl border border-[#241F17]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                    />
                  </div>
                </div>


                {/* PAN */}

                <div>
                  <label className="text-sm font-semibold text-[#241F17]">
                    PAN Number
                    <span className="ml-2 font-normal text-[#6E6353]">Optional</span>
                  </label>
                  <input
                    type="text"
                    name="pan_number"
                    value={form.pan_number}
                    onChange={handleChange}
                    maxLength={20}
                    autoComplete="off"
                    placeholder="ABCDE1234F"
                    className="mt-2 w-full rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 uppercase outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                  />
                </div>


                {/* Address */}

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-[#241F17]">Address</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    autoComplete="street-address"
                    placeholder="Address line"
                    className="mt-2 w-full rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                  />
                </div>


                {/* Address 2 */}

                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                    placeholder="Apartment, landmark or additional address details"
                    className="w-full rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                  />
                </div>


                {/* City */}

                <div>
                  <label className="text-sm font-semibold text-[#241F17]">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    placeholder="City"
                    className="mt-2 w-full rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                  />
                </div>


                {/* District */}

                <div>
                  <label className="text-sm font-semibold text-[#241F17]">District</label>
                  <input
                    type="text"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="District"
                    className="mt-2 w-full rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                  />
                </div>


                {/* State */}

                <div>
                  <label className="text-sm font-semibold text-[#241F17]">State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="mt-2 w-full rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                  />
                </div>


                {/* Pincode */}

                <div>
                  <label className="text-sm font-semibold text-[#241F17]">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="522001"
                    className="mt-2 w-full rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                  />
                </div>

              </div>

            </div>


            {/* ==========================================================
                DONATION SUMMARY — the detachable ticket stub
            =========================================================== */}

            <div className="h-fit rounded-[1.75rem] bg-[#FBF8EF] pt-7 shadow-2xl lg:sticky lg:top-6">

              <div className="flex items-center justify-between px-7">
                <div>
                  <p className="font-mono-vjf text-xs font-semibold uppercase tracking-[0.2em] text-[#A63D2C]">Donation Stub</p>
                  <h3 className="font-display mt-1 text-2xl font-bold text-[#241F17]">Your contribution</h3>
                </div>
                <FaTicketAlt className="text-2xl text-[#A63D2C]/40" />
              </div>

              <div className="px-7">

                {/* Purpose */}

                <div className="mt-7">
                  <label className="text-sm font-semibold text-[#241F17]">Donation Purpose</label>
                  <div className="relative mt-2">
                    <select
                      name="donation_type_id"
                      value={form.donation_type_id}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-[#241F17]/15 bg-white px-4 py-3.5 pr-10 outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                    >
                      {donationTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                    <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6E6353]" />
                  </div>
                </div>


                {/* Quick Amounts */}

                <div className="mt-7">
                  <label className="text-sm font-semibold text-[#241F17]">Select Amount</label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[500, 1000, 2000, 5000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() =>
                          setForm((previous) => ({ ...previous, amount: String(amount) }))
                        }
                        className={`rounded-xl border px-4 py-3 font-mono-vjf font-semibold transition ${
                          Number(form.amount) === amount
                            ? "border-[#A63D2C] bg-[#A63D2C]/10 text-[#A63D2C]"
                            : "border-[#241F17]/15 bg-white text-[#241F17] hover:border-[#A63D2C]/40"
                        }`}
                      >
                        ₹{formatAmount(amount)}
                      </button>
                    ))}
                  </div>
                </div>


                {/* Custom Amount */}

                <div className="mt-5">
                  <label className="text-sm font-semibold text-[#241F17]">Or enter your amount</label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono-vjf text-lg font-semibold text-[#6E6353]">₹</span>
                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      min="1"
                      max="500000"
                      required
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-[#241F17]/15 bg-white py-4 pl-10 pr-4 font-mono-vjf text-xl font-bold text-[#241F17] outline-none transition focus:border-[#A63D2C] focus:ring-4 focus:ring-[#A63D2C]/10"
                    />
                  </div>
                </div>

              </div>

              <TicketDivider bg="#FBF8EF" className="mt-7" />

              <div className="px-7 pb-7">

                {/* Summary */}

                <div className="mt-6 flex items-end justify-between">
                  <span className="font-semibold text-[#241F17]">Total Donation</span>
                  <span className="font-display text-3xl font-bold text-[#A63D2C]">
                    ₹{formatAmount(Number(form.amount) || 0)}
                  </span>
                </div>

                {/* Secure Pay */}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#E2963A] px-5 py-4 font-semibold text-[#1C2431] shadow-lg shadow-[#E2963A]/20 transition hover:bg-[#efab55] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#1C2431]/30 border-t-[#1C2431]" />
                      Preparing Secure Payment...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Proceed to Secure Payment
                      <FaArrowRight />
                    </>
                  )}
                </button>


                <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#5B7553]/10 p-4 text-xs leading-5 text-[#3F5238]">
                  <FaShieldAlt className="mt-0.5 shrink-0 text-[#5B7553]" />
                  <p>
                    Your payment is processed through Razorpay's secure
                    checkout. Your payment credentials are handled by
                    the payment gateway.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-4 font-mono-vjf text-xs font-medium text-[#6E6353]">
                  <span className="flex items-center gap-1.5"><FaCreditCard /> Cards</span>
                  <span className="flex items-center gap-1.5"><FaMobileAlt /> UPI</span>
                  <span className="flex items-center gap-1.5"><FaUniversity /> Net Banking</span>
                </div>

              </div>

            </div>

          </form>

        </div>

      </section>


      {/* ================================================================
          BANK DETAILS
      ================================================================= */}

      <section id="bank-details" className="bg-[#F3EEDF] py-24">

        <div className="mx-auto max-w-6xl px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>
              <SectionEyebrow>Alternative payment</SectionEyebrow>
              <h2 className="font-display mt-4 text-4xl font-bold text-[#241F17] sm:text-5xl">
                Direct bank transfer
              </h2>
              <p className="mt-6 leading-8 text-[#6E6353]">
                If you prefer to contribute directly through
                your bank, you can use the official account
                details below.
              </p>
              <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#E2963A]/10 p-5 text-sm leading-6 text-[#7A5417]">
                <FaShieldAlt className="mt-1 shrink-0" />
                Please retain your transaction reference
                for acknowledgement and reconciliation.
              </div>
            </div>


            <div className="overflow-hidden rounded-[1.75rem] bg-[#1C2431] shadow-2xl">

              <div className="border-b border-white/10 px-7 py-6">
                <p className="font-mono-vjf text-xs font-semibold uppercase tracking-wider text-[#E2963A]">Official account</p>
                <h3 className="font-display mt-2 text-2xl font-bold text-[#F3EEDF]">Vidya Jyothi Foundation</h3>
              </div>

              <div className="ledger-rows grid gap-x-6 p-7 sm:grid-cols-2">

                {bankDetails.map((detail) => (
                  <div key={detail.label} className={`py-3 ${detail.full ? "sm:col-span-2" : ""}`}>
                    <p className="font-mono-vjf text-xs text-[#9AA1AE]">{detail.label}</p>
                    <p className="mt-1 font-mono-vjf font-semibold text-[#F3EEDF]">{detail.value}</p>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================================
          UPI
      ================================================================= */}

      <section className="chalk-dust bg-[#1C2431] py-24 text-[#F3EEDF]">

        <div className="mx-auto max-w-5xl px-6">

          <div className="rounded-[1.75rem] bg-[#FBF8EF] p-8 text-center text-[#241F17] shadow-xl sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#A63D2C]/10 text-2xl text-[#A63D2C]">
              <FaMobileAlt />
            </div>
            <h2 className="font-display mt-6 text-4xl font-bold">Donate using UPI</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#6E6353]">
              For direct UPI donations, scan the official QR code
              or use the registered UPI ID.
            </p>

            <div className="mx-auto mt-10 flex max-w-sm items-center justify-center rounded-3xl border-2 border-dashed border-[#241F17]/20 bg-[#F3EEDF] p-10">
              <div>
                <div className="text-7xl">📱</div>
                <p className="mt-4 text-sm text-[#6E6353]">Replace with official UPI QR code</p>
              </div>
            </div>

            <div className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#241F17]/5 px-6 py-3">
              <span className="font-mono-vjf font-semibold text-[#A63D2C]">vidyajyothi@upi</span>
            </div>

          </div>

        </div>

      </section>


      {/* ================================================================
          TRANSPARENCY
      ================================================================= */}

      <section className="bg-[#F3EEDF] py-24">

        <div className="mx-auto max-w-6xl px-6">

          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>Accountability</SectionEyebrow>
            <h2 className="font-display mt-4 text-4xl font-bold text-[#241F17] sm:text-5xl">
              Our transparency promise
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#6E6353]">
              Every contribution should be handled responsibly,
              documented properly and used for the Foundation's
              approved educational initiatives.
            </p>
          </div>


          <div className="mt-14 grid gap-4 md:grid-cols-2">

            {transparencyPoints.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-[#241F17]/10 bg-[#FBF8EF] p-5"
              >
                <FaCheckCircle className="shrink-0 text-[#5B7553]" />
                <span className="font-medium text-[#241F17]">{item}</span>
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* ================================================================
          FAQ
      ================================================================= */}

      <section className="bg-[#F3EEDF] pb-24">

        <div className="mx-auto max-w-4xl px-6">

          <div className="text-center">
            <SectionEyebrow>FAQ</SectionEyebrow>
            <h2 className="font-display mt-4 text-4xl font-bold text-[#241F17] sm:text-5xl">
              Questions about donating?
            </h2>
          </div>


          <div className="mt-12 space-y-4">

            {faqItems.map((item) => (

              <details key={item.q} className="group rounded-2xl border border-[#241F17]/10 bg-[#FBF8EF] p-6">
                <summary className="cursor-pointer list-none font-display font-bold text-[#241F17]">
                  <div className="flex items-center justify-between gap-4">
                    <span>{item.q}</span>
                    <FaChevronDown className="shrink-0 text-[#A63D2C] transition group-open:rotate-180" />
                  </div>
                </summary>
                <p className="mt-4 leading-7 text-[#6E6353]">{item.a}</p>
              </details>

            ))}

          </div>

        </div>

      </section>


      {/* ================================================================
          CONTACT
      ================================================================= */}

      <section className="chalk-dust bg-[#1C2431] py-24">

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">
            <SectionEyebrow dark>Need help?</SectionEyebrow>
            <h2 className="font-display mt-4 text-4xl font-bold text-[#F3EEDF] sm:text-5xl">
              We're here to help.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#B9AF9C]">
              Contact the Foundation if you need assistance
              with a donation or sponsorship.
            </p>
          </div>


          <div className="mt-14 grid gap-5 md:grid-cols-3">

            {contactChannels.map((channel) => (

              <a
                key={channel.title}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 text-center transition hover:bg-white/[0.08]"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2963A]/10 text-2xl text-[#E2963A]">
                  {channel.icon}
                </span>
                <h3 className="font-display mt-5 text-xl font-bold text-[#F3EEDF]">{channel.title}</h3>
                <p className="mt-2 break-all text-[#B9AF9C]">{channel.value}</p>
              </a>

            ))}

          </div>

        </div>

      </section>


      {/* ================================================================
          FINAL CTA
      ================================================================= */}

      <section className="relative overflow-hidden bg-[#E2963A] py-20">

        <div className="relative mx-auto max-w-5xl px-6 text-center">

          <FaQuoteLeft className="mx-auto text-3xl text-[#1C2431]/40" />

          <h2 className="font-display mt-6 text-4xl font-bold text-[#1C2431] sm:text-5xl">
            Together, we can open more doors to education.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#1C2431]/80">
            Every contribution represents an opportunity for a student
            to continue learning, pursue their goals and build a
            stronger future.
          </p>

          <a
            href="#donation-form"
            className="mt-9 inline-flex items-center gap-3 rounded-xl bg-[#1C2431] px-7 py-4 font-semibold text-[#F3EEDF] shadow-xl transition hover:-translate-y-0.5 hover:bg-[#141B24]"
          >
            Make a Donation
            <FaArrowRight />
          </a>

        </div>

      </section>

    </div>

  );

}


export default Donate;