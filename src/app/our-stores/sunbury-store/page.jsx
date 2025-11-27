
import Link from 'next/link';
export const metadata = {
  title: "Vacuum Cleaner Shop Sunbury | Repairs & Sales Service",
  description:
    "Vacuum Cleaner Shop in Sunbury Explore quality vacuums, accessories and reliable vacuum cleaner repairs with fast, friendly service at our Sunbury store.",
  alternates: {
    canonical: "https://vaccom.com.au/our-stores/sunbury-store",
  },
};
export default function SunburyPage() {
  return (
    <main>
      <section
        className="w-full h-[400px] bg-cover bg-center flex items-center text-left px-5"
        style={{
          backgroundImage: "url('/store-img/store-banner1.webp')"
        }}
      >
        <div className="text-white max-w-4xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Your Local Vacuum Cleaner Shop
          </h1>

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
                  { name: 'Dyson Vacuum Repair and Services', link: '/dyson-vaccum-repair-and-services-in-sunbury' },
                  { name: 'Electrolux Vacuum Repair and Services', link: '/electrolux-vaccum-repair-and-services-in-sunbury' },
                  { name: 'Hoover Vacuum Repair and Services', link: '/hoover-vaccum-repair-and-services-in-sunbury' },
                  { name: 'Miele Vacuum Repair and Services', link: '/miele-vaccum-repair-and-services-in-sunbury' },
                  { name: 'Robot Vacuum Repair and Services', link: '/robot-vaccum-repair-and-services-in-sunbury' },
                  { name: 'Shark Vacuum Repair and Services', link: '/shark-vaccum-repair-and-services-in-sunbury' },
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
            <li><strong>Top Vacuum Brands</strong> We stock trusted names like Tineco, Hoover, Shark, Karcher, and more.</li>
            <li><strong>Expert Support:</strong> Our knowledgeable team is here to help you choose the right vacuum or accessory for your needs.</li>
            <li><strong>Best Price Guarantee:</strong> Fast, professional repair services to keep your vacuum running like new.</li>
            <li><strong>Affordable Prices:</strong>  Great deals on quality products and parts—value you can count on.</li>
            <li><strong> Convenient Location:</strong> Located in the heart of Sunbury, easily accessible from nearby suburbs.</li>
          </ul>
        </div>

        {/* Serving Areas */}
        <div>
          <h2 className="text-5xl font-bold mb-4 mt-10">Serving Areas</h2>
          <div className="h-1 w-20 bg-red-600 mb-2"></div>
          <p className="mb-4">We proudly serve Sunbury and surrounding suburbs including:

          </p>
          <p className="mb-4">Gisborne , Diggers Rest, Riddells Creek, Melton, Romsey, Macedon, Woodend

          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d404723.26191080426!2d144.728733!3d-37.580961!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad6f9b84a58eecb%3A0x20ce86871800250a!2s93%20Evans%20St%2C%20Sunbury%20VIC%203429%2C%20Australia!5e0!3m2!1sen!2sus!4v1764234836664!5m2!1sen!2sus"
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
              <h3 className="text-3xl font-semibold mb-5 px-5 py-2 text-red-600">Sunbury
              </h3>
              <p className="text-[16px] text-gray-800 px-3 ">
                <span className="font-semibold ">Address:</span> 93 Evans St, Sunbury VIC 3429
              </p>
            </div>

            {/* Contact */}
            <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-3xl font-semibold mb-5 px-5 py-2 text-red-600">Contact</h3>
              <p className="text-[16px] text-gray-800 px-3">
                <span className="font-semibold">Call now:</span> 0397 409 390

              </p>
              <p className="text-[16px] text-gray-800 px-3">
                <span className="font-semibold">E-mail:</span>  sunbury@vaccom.com.au
              </p>
            </div>

            {/* Open Hours */}
            <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-3xl font-semibold mb-5 px-5 py-2 text-red-600">Open Hours</h3>
              <p className="text-[16px] text-gray-800 px-3">
                <span className="font-semibold">Days:</span> Monday – Sunday
              </p>
              <p className="text-[16px] text-gray-800 px-3">
                <span className="font-semibold">Time:</span> 9:00 AM – 5:30 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
