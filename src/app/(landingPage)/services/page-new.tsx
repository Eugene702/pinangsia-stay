import Image from 'next/image'
import Link from 'next/link'
import LandingNavbar from '../components/LandingNavbar'
import LandingFooter from '../components/LandingFooter'

const ServicesPage = () => {
  const services = [
    {
      title: 'Superior Room',
      image: '/images/kamar1.png',
      price: 'IDR 850,000',
      features: ['City View', 'Free WiFi', 'Air Conditioning', 'Private Bathroom', 'Room Service'],
      description: 'Spacious and comfortable rooms with modern amenities perfect for business travelers.'
    },
    {
      title: 'Deluxe Suite',
      image: '/images/kamar2.jpg',
      price: 'IDR 1,200,000',
      features: ['Ocean View', 'Separate Living Area', 'Kitchenette', 'Premium Amenities', 'Concierge Service'],
      description: 'Luxurious suite with separate living area and premium facilities for extended stays.'
    },
    {
      title: 'Executive Room',
      image: '/images/kamar3.jpg',
      price: 'IDR 950,000',
      features: ['Work Desk', 'High-Speed Internet', 'Business Center Access', 'Meeting Room', 'Executive Lounge'],
      description: 'Business-friendly room with dedicated workspace and professional amenities.'
    }
  ]

  const facilities = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Premium Rooms',
      description: 'Comfortable and well-appointed rooms with modern amenities'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Restaurant',
      description: 'Fine dining with local and international cuisine'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Meeting Rooms',
      description: 'Professional meeting spaces for business events'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 8.5v3m-4-7h8m-8 0V9a4 4 0 118 0v3.5M12 17.5L8 21l4-3.5L16 21l-4-3.5z" />
        </svg>
      ),
      title: '24/7 Service',
      description: 'Round-the-clock assistance and room service'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center">
        <Image
          src="/images/hotel.webp"
          alt="Our Services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Our Services
          </h1>
          <p className="text-xl lg:text-2xl leading-relaxed">
            Discover our premium accommodations and exceptional facilities designed for your comfort
          </p>
        </div>
      </section>

      {/* Room Services */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Premium Accommodations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully designed rooms and suites
            </p>
          </div>
          
          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-4">
                    {service.price} <span className="text-base font-normal text-gray-500">per night</span>
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg inline-block"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Hotel Facilities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enjoy our comprehensive range of amenities and services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group hover:-translate-y-2"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  {facility.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {facility.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}

export default ServicesPage
