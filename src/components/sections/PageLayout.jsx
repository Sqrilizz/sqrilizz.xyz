import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import ProjectsSection from './ProjectsSection'
import SetupSection from './SetupSection'
import GuestbookSection from './GuestbookSection'
import ContactSection from './ContactSection'
import Footer from './Footer'

export default function PageLayout() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SetupSection />
      <GuestbookSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
