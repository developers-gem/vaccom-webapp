"use client";
import React, { useState } from "react";
import { FiPhone } from "react-icons/fi";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSuccess("✅ Thank you! We’ll contact you shortly.");
      setForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section
        className="w-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/banner-img/contact-bg.png')" }}
      >
        <div className="absolute inset-0 bg-red-600 opacity-70"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div className="text-white space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Contact Us Today!
            </h2>
            <p className="text-lg md:text-xl">
              Send us some information and we will follow up.
            </p>

            <div className="bg-white text-red-600 flex items-center gap-2 py-3 px-5 rounded-md w-fit font-bold shadow-md">
              <FiPhone /> 0397-409-390
            </div>
          </div>

          {/* Right Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-red-700 rounded-lg p-8 space-y-4 shadow-lg"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name*"
              className="w-full p-3 rounded"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email*"
              className="w-full p-3 rounded"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone*"
              className="w-full p-3 rounded"
            />

            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 rounded"
            >
              <option value="">Select your store*</option>
              <option>Melbourne</option>
              <option>Sydney</option>
              <option>Brisbane</option>
            </select>

            <textarea
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder="Message*"
              className="w-full p-3 rounded"
            />

            {success && <p className="text-green-200">{success}</p>}
            {error && <p className="text-yellow-200">{error}</p>}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-8 py-3 rounded hover:bg-white hover:text-black transition"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
