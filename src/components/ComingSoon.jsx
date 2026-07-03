import { FaImages } from "react-icons/fa";

function ComingSoon({ title }) {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-xl text-center bg-white shadow-lg rounded-2xl p-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <FaImages className="text-yellow-500 text-4xl" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          {title}
        </h1>

        <p className="text-lg text-gray-600 leading-8">
          We're currently preparing this gallery.
          <br />
          Photos, videos, and updates will be available here soon.
        </p>

        <div className="mt-8 inline-block bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold">
          🚧 Coming Soon
        </div>
      </div>
    </section>
  );
}

export default ComingSoon;