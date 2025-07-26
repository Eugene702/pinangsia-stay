import Image from 'next/image'
import Link from 'next/link'
import LandingNavbar from '../components/LandingNavbar'
import ContactSection from '../components/ContactSection'
import LandingFooter from '../components/LandingFooter'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center">
        <Image
          src="/images/hotel-pinangsia-yakarta-20201031100437.jpg"
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl lg:text-2xl leading-relaxed">
            Get in touch with our friendly team for reservations and inquiries
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Map Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Find Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Located in the heart of Jakarta with easy access to major attractions
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Location</h3>
                <p className="text-gray-600 mb-4">Jl. Pinangsia Raya No. 123, Jakarta Barat</p>
                <a
                  href="https://maps.google.com/maps?q=Pinangsia+Jakarta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                >
                  Open in Google Maps
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}

export default ContactPage
