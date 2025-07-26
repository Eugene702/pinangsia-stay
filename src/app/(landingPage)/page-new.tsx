import LandingNavbar from './components/LandingNavbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import TestimonialsSection from './components/TestimonialsSection'
import ContactSection from './components/ContactSection'
import LandingFooter from './components/LandingFooter'

const page = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  )
}

export default page
