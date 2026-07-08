function PersonalDetails({
  formData,
  setFormData,
  errors,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Student Name */}
        <div>
          <label className="block mb-2 font-medium">
            Student Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter Student Name"
            className={`w-full rounded-lg px-4 py-3 border outline-none transition ${
              errors.studentName
                ? "border-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
            }`}
          />

          {errors.studentName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.studentName}
            </p>
          )}
        </div>

        {/* Father Name */}
        <div>
          <label className="block mb-2 font-medium">
            Father Name
          </label>

          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Enter Father Name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Mother Name */}
        <div>
          <label className="block mb-2 font-medium">
            Mother Name
          </label>

          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Enter Mother Name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block mb-2 font-medium">
            Date of Birth
          </label>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-2 font-medium">
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Mobile */}
        <div>
          <label className="block mb-2 font-medium">
            Mobile Number <span className="text-red-500">*</span>
          </label>

          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
            maxLength={10}
            className={`w-full rounded-lg px-4 py-3 border outline-none transition ${
              errors.mobile
                ? "border-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
            }`}
          />

          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">
              {errors.mobile}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email Address"
            className={`w-full rounded-lg px-4 py-3 border outline-none transition ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
            }`}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Aadhaar */}
        <div>
          <label className="block mb-2 font-medium">
            Aadhaar Number <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
            placeholder="Enter 12-digit Aadhaar Number"
            maxLength={12}
            className={`w-full rounded-lg px-4 py-3 border outline-none transition ${
              errors.aadhaar
                ? "border-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
            }`}
          />

          {errors.aadhaar && (
            <p className="text-red-500 text-sm mt-1">
              {errors.aadhaar}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default PersonalDetails;