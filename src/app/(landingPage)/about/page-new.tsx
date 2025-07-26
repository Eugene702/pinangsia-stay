import Image from 'next/image'
import LandingNavbar from '../components/LandingNavbar'
import LandingFooter from '../components/LandingFooter'

const AboutPage = () => {
  const values = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, from the moment you arrive until you leave.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      title: 'Hospitality',
      description: 'Our warm and genuine hospitality ensures every guest feels welcomed and valued during their stay.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Quality',
      description: 'We maintain the highest standards of quality in our facilities, services, and guest experiences.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Innovation',
      description: 'We continuously innovate and improve our services to exceed guest expectations and industry standards.'
    }
  ]

  const team = [
    {
      name: 'Amanda Sarah',
      role: 'General Manager',
      photo: '/images/mando.jpg',
      description: 'With over 15 years of experience in hospitality management, Amanda leads our team with passion and dedication.'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director',
      photo: '/images/hotel.webp',
      description: 'Michael ensures smooth daily operations and maintains our high standards of service excellence.'
    },
    {
      name: 'Sarah Williams',
      role: 'Guest Relations Manager',
      photo: '/images/kutip.png',
      description: 'Sarah is dedicated to creating memorable experiences for our guests and handling special requests.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <Image
          src="/images/hotel-pinangsia-yakarta-20201031100437.jpg"
          alt="Hotel Pinangsia"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            About Pinangsia Stay
          </h1>
          <p className="text-xl lg:text-2xl leading-relaxed">
            Discover the story behind Jakarta's premier hospitality destination, where luxury meets warmth and excellence defines every experience.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Established in the heart of Jakarta, Pinangsia Stay began as a vision to create a home away from home for travelers from around the world. Our founders believed that hospitality is more than just providing accommodation—it's about creating meaningful connections and unforgettable experiences.
                </p>
                <p>
                  Over the years, we have grown from a small boutique hotel to one of Jakarta's most trusted hospitality brands, while never losing sight of our core values: genuine warmth, exceptional service, and attention to detail that makes every guest feel special.
                </p>
                <p>
                  Today, Pinangsia Stay stands as a testament to Indonesian hospitality, blending modern luxury with traditional warmth to create an experience that guests treasure long after their stay ends.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hotel.webp"
                  alt="Hotel interior"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full"></div>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our guiding principles that drive everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-lg">
              <div className="text-primary mb-6">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To be Jakarta's most beloved hotel, recognized globally for setting new standards in hospitality excellence, where every guest experiences the perfect blend of luxury, comfort, and genuine Indonesian warmth.
              </p>
            </div>
            
            <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-lg">
              <div className="text-primary mb-6">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To provide exceptional hospitality experiences that exceed expectations, create lasting memories, and make every guest feel valued and cared for through our dedicated service, premium facilities, and commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The core principles that guide our team and shape every guest interaction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate professionals who make your stay exceptional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-80">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">10+</div>
              <div className="text-xl opacity-90">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">1000+</div>
              <div className="text-xl opacity-90">Happy Guests</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">50+</div>
              <div className="text-xl opacity-90">Premium Rooms</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">4.9</div>
              <div className="text-xl opacity-90">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}

export default AboutPage
