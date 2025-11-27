import Link from 'next/link';

export const metadata = {
  title: "Vacuum Cleaner Shop Cheltenham | Repairs & Sales Service",
  description:
    "Visit our Vacuum Cleaner Shop in Cheltenham for premium vacuums, accessories and expert vacuum cleaner repairs. Fast service, top brands and the best repair solutions.",
  alternates: {
    canonical: "https://vaccom.com.au/our-stores/cheltenham-store",
  },
};
export default function CheltenhamPage() {
  return (
    <main>
      {/* Hero Section */}
      <section
        className="w-full h-[400px] bg-cover bg-center flex items-center text-left px-5"
        style={{ backgroundImage: "url('/store-img/store-banner1.webp')" }}
      >
        <div className="text-white max-w-4xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Your Local Vaccom Cleaner Shop</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
  {/* Left Side */}
  <div className="md:col-span-2 space-y-10"> {/* Reduced spacing */}
    
    {/* About Us */}
    <div>
      <h2 className="text-5xl font-bold mb-4">About Us</h2>
      <div className="h-1 w-20 bg-red-600 mb-4"></div>
      <p className="text-base leading-7">
        Vaccom Cheltenham is your go-to destination for all your vacuum cleaner needs. Located
        conveniently in Cheltenham, VIC, we offer a wide range of products, expert advice, and a
        best price guarantee. Contact us at 0385 242 199 or visit us at Westfield Shopping Centre.
      </p>
    </div>

    {/* Products and Services */}
    <div>
      <h2 className="text-[40px] font-bold mb-8">Products and Services</h2> {/* Smaller margin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img src="/store-img/img1.jpg" alt="Stick Vacuum" />
          <h3 className="text-[28px] font-bold mt-4">Stick Vacuums</h3> {/* Smaller spacing */}
          <p className="text-[18px]">Lightweight and cordless for easy cleaning.</p>
        </div>
        <div>
          <img src="/store-img/img2.jpg" alt="Robot Vacuum" />
          <h3 className="text-[28px] font-bold mt-4">Robot Vacuums</h3>
          <p className="text-[18px]">Automated cleaning for a hands-free experience.</p>
        </div>
        <div>
          <img src="/store-img/img3.jpg" alt="Accessories" />
          <h3 className="text-[28px] font-bold mt-4">Accessories</h3>
          <p className="text-[18px]">All the parts and extras you need.</p>
        </div>
      </div>
    </div>
  </div>

  {/* Sidebar */}
  <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-100">
    <aside className="space-y-2"> {/* Slightly reduced vertical spacing */}
      <div>
        <h4 className="text-[22px] font-semibold mb-2">Location: Cheltenham</h4>
       <ul className="text-[16px] font-medium text-gray-900 space-y-2">
  {[
    { name: 'Dyson Vacuum Repair and Services', link: '/dyson-vaccum-repair-and-services-in-cheltenham' },
    { name: 'Electrolux Vacuum Repair and Services', link: '/electrolux-vaccum-repair-and-services-in-cheltenham' },
    { name: 'Hoover Vacuum Repair and Services', link: '/hoover-vaccum-repair-and-services-in-cheltenham' },
    { name: 'Miele Vacuum Repair and Services', link: '/miele-vaccum-repair-and-services-in-cheltenham' },
    { name: 'Robot Vacuum Repair and Services', link: '/robot-vaccum-repair-and-services-in-cheltenham' },
    { name: 'Shark Vacuum Repair and Services', link: '/shark-vaccum-repair-and-services-in-cheltenham' },
  ].map((service, idx) => (
    <li key={idx}>
      <Link
        href={service.link}
        className="hover:text-red-600 transition-colors duration-200"
      >
        → {service.name}
      </Link>
      <hr className="border-gray-200 my-1" />
    </li>
  ))}
</ul>

      </div>
    </aside>
  </div>
</section>


      {/* full section */}
          <section className="w-full py-10 px-4 md:px-16 bg-blue-10">
{/* Why Choose Us */}
          <div>
            <h2 className="text-5xl font-bold mb-4">Why Choose Us</h2>
            <div className="h-1 w-20 bg-red-600 mb-5"></div>
            <ul className="list-disc space-y-2 pl-5 text-[18px] mt-5">
              <li><strong>Wide Range of Vacuum Cleaners:</strong> From stick vacuums to robot cleaners, we stock all leading brands like <strong>Tineco, Hoover, Shark, Karcher</strong>, and more.</li>
              <li><strong>Expert Advice:</strong> Our friendly team is here to help you find the best cleaning solutions for your home or business.</li>
              <li><strong>Best Price Guarantee:</strong> Get the most competitive prices on all vacuum products and accessories.</li>
              <li><strong>Convenient Location:</strong> Situated in the heart of <strong>Cheltenham</strong>, we’re easy to reach from nearby areas like <strong>Moorabbin, Mentone, Highett</strong>, and <strong>Sandringham</strong>.</li>
              <li><strong>Vacuum Cleaner Repairs:</strong> Bring your vacuum in for reliable service and repairs by experienced technicians.</li>
            </ul>
          </div>

          {/* Serving Areas */}
          <div>
            <h2 className="text-5xl font-bold mb-4 mt-10">Serving Areas</h2>
            <div className="h-1 w-20 bg-red-600 mb-4"></div>
            <p className="mb-4">We proudly serve the following suburbs: Cheltenham, Moorabbin, Mentone, Highett, Sandringham, and surrounding areas.

</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3157.4419705123736!2d145.05179927579842!3d-37.96423527198159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad66b5f22a32737%3A0x5045675218ce3e0!2sCheltenham%20VIC%203192!5e0!3m2!1sen!2sau!4v1691577600000!5m2!1sen!2sau"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-md"
            ></iframe>
          </div>
            </section>  
 {/* Contact Highlights Section */}
<section className="w-full py-16 px-4 md:px-16 bg-blue-10">
  <div className="max-w-7xl mx-auto">
    {/* Title */}
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-black mb-2">Contact Us</h2>
      <div className="w-20 h-1 bg-red-600 mb-4"></div>
      <p className="text-[18px] md:text-xl font-medium text-black">
        Please contact us with any questions or to set up an appointment for a free quote by filling out the form below or giving us a call today!
      </p>
    </div>

    {/* Contact Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Head Office */}
      <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
        <h3 className="text-5xl font-semibold mb-5 px-5 py-2 text-red-600">Cheltenham
</h3>
        <p className="text-[20px] text-gray-800 px-3 ">
          <span className="font-semibold ">Address:</span> Shop 1020 Westfield Shopping Centre, 1156 Nepean Hwy, Cheltenham VIC 3192
        </p>
      </div>

      {/* Contact */}
      <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
        <h3 className="text-5xl font-semibold mb-5 px-5 py-2 text-red-600">Contact</h3>
        <p className="text-[20px] text-gray-800 px-3">
          <span className="font-semibold">Call now:</span> 0397 409 390
        </p>
        <p className="text-[20px] text-gray-800 px-3">
          <span className="font-semibold">E-mail:</span> support@vaccom.com.au
        </p>
      </div>

      {/* Open Hours */}
      <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
        <h3 className="text-5xl font-semibold mb-5 px-5 py-2 text-red-600">Open Hours</h3>
        <p className="text-[20px] text-gray-800 px-3">
          <span className="font-semibold">Days:</span> Monday – Sunday
        </p>
        <p className="text-[20px] text-gray-800 px-3">
          <span className="font-semibold">Time:</span> 9:00 AM – 5:30 PM
        </p>
      </div>
    </div>
  </div>
</section>

    </main>
  );
}
