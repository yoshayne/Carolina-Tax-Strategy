import Header from '@/react-app/components/Header';
import Hero from '@/react-app/components/Hero';
import ProblemSection from '@/react-app/components/ProblemSection';
import ServiceTiers from '@/react-app/components/ServiceTiers';
import ProcessSection from '@/react-app/components/ProcessSection';
import AudienceSections from '@/react-app/components/AudienceSections';
import SocialProof from '@/react-app/components/SocialProof';
import FinalCTA from '@/react-app/components/FinalCTA';
import Footer from '@/react-app/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <ServiceTiers />
        <ProcessSection />
        <AudienceSections />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
