'use client';
import React from 'react';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

export default function ContactUs() {
  return (
    <main>
      {/* Hero Background */}
     <section
  className="w-full h-[400px] bg-cover bg-center flex items-center text-left px-5"
  style={{
    backgroundImage: "url('/banner-img/banner-image5.webp')"
  }}
>
  <div className="text-white max-w-4xl space-y-4">
    <h1 className="text-4xl md:text-5xl font-bold">
      Get in Touch with Vaccom
    </h1>
    <p className="text-2xl md:text-2xl font-medium">
      We’re here to help with all your cleaning needs.
    </p>
  </div>
</section>


      {/* Content */}
     <section className="py-12 px-5 w-full mx-auto  md:grid-cols-12 gap-10">
  <div className="space-y-4">
    <h1 className="text-4xl md:text-4xl font-bold">Contact Us</h1>
    
    {/* Red underline just below heading */}
    <div className="h-1 w-20 bg-red-600 mb-4"></div>

    <p className="text-2xl md:text-xl font-medium text-gray-600">
      Please contact us with any questions or to set up an appointment for a free quote by filling out the form below or giving us a call today!
    </p>
  </div>

  
</section>
{/* Service Highlights */}
<div className="grid md:grid-cols-3 gap-6 mb-5 px-5">
  {/* Head Office */}
  <div className="border border-gray-200 p-6 rounded shadow hover:shadow-md transition">
    <h3 className="text-4xl font-bold mb-2 px-5 py-5 text-red-600">Head Office</h3>
    <p className="text-[18px] text-black-600">
      <span className="font-semibold ">Address:</span> 158 Centre Dandenong Rd. Victoria 3192
    </p>
  </div>

  {/* Contact */}
  <div className="border border-gray-200 p-6 rounded shadow hover:shadow-md transition">
    <h3 className="text-4xl font-bold mb-2 px-5 py-5 text-red-600">Contact</h3>
    <p className="text-[18px]  text-black-600">
      <span className="font-semibold">Call now:</span> 0397 409 390
    </p>
    <p className="text-[18px]  text-black-600">
      <span className="font-semibold">E-mail:</span> support@vaccom.com.au
    </p>
  </div>

  {/* Open Hours */}
  <div className="border border-gray-200 p-6 rounded shadow hover:shadow-md transition">
    <h3 className="text-4xl font-bold mb-2 px-5 py-5 text-red-600">Open Hours</h3>
    <p className="text-[18px] text-black-600">
      <span className="font-semibold">Days:</span> Monday – Sunday
    </p>
    <p className="text-[18px] text-black-600">
      <span className="font-semibold">Time:</span> 9:00 AM – 5:30 PM
    </p>
  </div>
</div>

{/* MAP */}
			<section className="w-full  px-5 py-5 mb-5 ">
  <div>
					<div className="h-1 mt-5 w-20 mb-4" />
				
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3157.4419705123736!2d145.05179927579842!3d-37.96423527198159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad66b5f22a32737%3A0x5045675218ce3e0!2sCheltenham%20VIC%203192!5e0!3m2!1sen!2sau!4v1691577600000!5m2!1sen!2sau"
						width="100%"
						height="400"
						style={{ border: 0 }}
						allowFullScreen=""
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						className="rounded-lg shadow-md"
					/>
				</div>
</section>

 <section
      className="w-full bg-cover bg-center relative"
      style={{ backgroundImage: "url('/banner-img/contact-bg.png')" }}
    >
      {/* Red overlay */}
      <div className="absolute inset-0 bg-red-600 opacity-70"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div className="text-white space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">Contact Us Today!</h2>
          <p className="text-lg md:text-xl">
            Send us some information and we will follow up to show how we can help.
          </p>
          <h3 className="text-2xl font-semibold">Ready To Get Started</h3>

          <div className="bg-white text-red-600 flex items-center gap-2 py-3 px-5 rounded-md w-fit font-bold shadow-md">
                       <FiPhone />
 0397-409-390
          </div>
        </div>

        {/* Right Side Form */}
        <div className="bg-red-700 rounded-lg p-8 space-y-4 shadow-lg">
          <div>
            <label className="text-white font-semibold">Name *</label>
            <input
              type="text" 
              placeholder="Full Name*"
              className="w-full mt-1 p-3 rounded text-sm focus:outline-none bg-white"
            />
          </div>
          <div>
            <label className="text-white font-semibold">Email *</label>
            <input
              type="email"
              placeholder="Email*"
              className="w-full mt-1 p-3 rounded text-sm focus:outline-none bg-white"
            />
          </div>
          <div>
            <label className="text-white font-semibold">Numbers *</label>
            <input
              type="text"
              placeholder="Phone*"
              className="w-full mt-1 p-3 rounded text-sm focus:outline-none bg-white"
            />
          </div>
          <div>
            <label className="text-white font-semibold">Select Store Location *</label>
            <select className="w-full mt-1 p-3 rounded text-sm focus:outline-none bg-white">
              <option>Select your store*</option>
              <option>Melbourne</option>
              <option>Sydney</option>
              <option>Brisbane</option>
            </select>
          </div>
          <div>
            <label className="text-white font-semibold">Message *</label>
            <textarea
              rows={4}
              placeholder="Message*"
              className="w-full mt-1 p-3 rounded text-sm focus:outline-none bg-white"
            ></textarea>
          </div>
          {/* Submit Button */}
 <div className="flex justify-center">
  <button
    type="submit"
    className="w-1/5 mt-4 bg-black hover:bg-white hover:text-black text-white font-bold py-3 px-6 rounded transition-colors duration-300"
  >
    Submit
  </button>
</div>

        </div>
      </div>
    </section>
    </main>
  );
}
