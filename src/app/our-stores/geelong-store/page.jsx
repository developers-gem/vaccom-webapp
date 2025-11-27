import { link } from 'fs';
import Link from 'next/link';
export const metadata = {
  title: "Vacuum Cleaner Shop Geelong – Repairs & Sales",
  description:
    "Vacuum Cleaner Shop in Geelong — top vacuums, accessories & expert vacuum cleaner repairs. Visit us for fast service and great deals! Huge brand selection too.",
  alternates: {
    canonical: "https://vaccom.com.au/our-stores/geelong-store",
  },
};
export default function GeelongPage() {
	return (
		<main>
			<section
				className="w-full h-[400px] bg-cover bg-center flex items-center text-left px-5"
				style={{
					backgroundImage: "url('/store-img/store-banner2.webp')"
				}}
			>
				<div className="text-white max-w-4xl space-y-4">
					<h1 className="text-4xl md:text-5xl font-bold">Your Local Vacuum Cleaner Shop</h1>
				</div>
			</section>

			{/* Main Content */}
			<section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
				{/* Left Side */}
				<div className="md:col-span-2 space-y-10">
					{' '}
					{/* Reduced spacing */}
					{/* About Us */}
					<div>
						<h2 className="text-5xl font-bold mb-4">About Us</h2>
						<div className="h-1 w-20 bg-red-600 mb-4" />
						<p className="text-base leading-7">
							Vaccom Geelong is your go-to destination for all your vacuum cleaner needs. Located
							conveniently in Geelong, VIC, we offer a wide range of products, expert advice, and a best
							price guarantee. Contact us at 0352 786 999 or visit us at Westfield Shopping Centre.
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
									{ name: 'Dyson Vacuum Repair and Services', link: '/dyson-vaccum-repair-and-services-in-geelong' },
									{ name: 'Electrolux Vacuum Repair and Services', link: '/electrolux-vaccum-repair-and-services-in-geelong' },
									{ name: 'Hoover Vacuum Repair and Services', link: '/hoover-vaccum-repair-and-services-in-geelong' },
									{ name: 'Miele Vacuum Repair and Services', link: '/miele-vaccum-repair-and-services-in-geelong' },
									{ name: 'Robot Vacuum Repair and Services', link: '/robot-vaccum-repair-and-services-in-geelong' },
									{ name: 'Shark Vacuum Repair and Services', link: '/shark-vaccum-repair-and-services-in-geelong' },
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
					<div className="h-1 w-20 bg-red-600 mb-5" />
					<ul className="list-disc space-y-2 pl-5 text-[18px] mt-5">
						<li>
							<strong>Top Brands Available:</strong> Discover premium vacuum cleaners from trusted brands
							like Tineco, Hoover, Shark, and Karcher.
						</li>
						<li>
							<strong>Great Value:</strong> Enjoy competitive prices on vacuum cleaners, spare parts, and
							accessories.
						</li>
						<li>
							<strong>Expert Advice:</strong> Our friendly team is ready to help you choose the best
							cleaning solution for your home or business.
						</li>
						<li>
							<strong>Professional Repairs:</strong> Keep your vacuum performing at its best with our
							reliable repair and maintenance services.
						</li>
						<li>
							<strong>Easy to Reach:</strong> Conveniently located in Geelong, we’re easily accessible
							from Newtown, Belmont, Waurn Ponds, Corio, and surrounding areas.
						</li>
					</ul>
				</div>

				{/* Serving Areas */}
				<div>
					<h2 className="text-5xl font-bold mb-4 mt-10">Serving Areas</h2>
					<div className="h-1 w-20 bg-red-600 mb-4" />
					<p className="mb-4">
						Located on Malop Street, Vaccom Geelong is perfectly positioned to serve customers from: Newtown
						, Belmont, Waurn Ponds, Corio, Highton, Lara, Grovedale
					</p>
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d401618.1133904479!2d144.364624!3d-38.148528!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad4141ef50cf591%3A0x74d4251c745ddc55!2s162%20Malop%20St%2C%20Geelong%20VIC%203220%2C%20Australia!5e0!3m2!1sen!2sus!4v1764234734230!5m2!1sen!2sus"
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
			{/* Contact Highlights Section */}
			<section className="w-full py-16 px-4 md:px-16 bg-blue-10">
				<div className="max-w-7xl mx-auto">
					{/* Title */}
					<div className="mb-12">
						<h2 className="text-4xl font-bold text-black mb-2">Contact Us</h2>
						<div className="w-20 h-1 bg-red-600 mb-4" />
						<p className="text-[18px] md:text-xl font-medium text-black">
							Please contact us with any questions or to set up an appointment for a free quote by filling
							out the form below or giving us a call today!
						</p>
					</div>

					{/* Contact Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Head Office */}
						<div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
							<h3 className="text-3xl font-semibold mb-5 px-5 py-2 text-red-600">Geelong</h3>
							<p className="text-[16px] text-gray-800 px-3 ">
								<span className="font-semibold ">Address:</span> 162 Malop St, Geelong VIC 3220
							</p>
						</div>

						{/* Contact */}
						<div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
							<h3 className="text-3xl font-semibold mb-5 px-5 py-2 text-red-600">Contact</h3>
							<p className="text-[16px] text-gray-800 px-3">
								<span className="font-semibold">Call now:</span> 0397 409 390
							</p>
							<p className="text-[16px] text-gray-800 px-3">
								<span className="font-semibold">Phone:</span> 0342070300
							</p>
							<p className="text-[16px] text-gray-800 px-3">
								<span className="font-semibold">E-mail:</span> geelong@vaccom.com.au
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
