import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, Monitor, Upload, Palette, ArrowRight, ArrowLeft } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    title: 'Talk to Remy',
    description: 'Start a conversation with Remy about your kitchen ideas.',
    icon: Mic,
    color: 'bg-kitchance-navy-dark',
  },
  {
    title: 'Upload Photos',
    description: 'Share images of your current kitchen space.',
    icon: Upload,
    color: 'bg-kitchance-blue-deep',
  },
  {
    title: 'Get Suggestions',
    description: 'Receive personalized design recommendations.',
    icon: Palette,
    color: 'bg-kitchance-blue-medium',
  },
  {
    title: 'Visualize',
    description: 'See your new kitchen in detailed 2D and 3D renders.',
    icon: Monitor,
    color: 'bg-kitchance-blue-light',
  },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleNext = () => setCurrentStep((prev) => (prev + 1) % steps.length);
  const handlePrev = () => setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);

  const Icon = steps[currentStep].icon;

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        {/* Features Preview Section */}
        <section className="section bg-gray-50">
          <div className="container mx-auto">
            <h2 className="section-title fade-in">Reimagine Your Kitchen with AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={Mic}
                title="Voice Interaction"
                description="Talk naturally with Remy to describe your dream kitchen design."
                color="bg-kitchance-navy-dark"
              />
              <FeatureCard
                icon={Monitor}
                title="2D & 3D Generation"
                description="See your kitchen come to life with detailed 2D and 3D visualizations."
                color="bg-kitchance-blue-deep"
              />
              <FeatureCard
                icon={Upload}
                title="Upload Your Space"
                description="Start with your current kitchen and see the transformation."
                color="bg-kitchance-blue-medium"
              />
              <FeatureCard
                icon={Palette}
                title="Personalized Designs"
                description="Get design options that match your style and preferences."
                color="bg-kitchance-navy-dark"
              />
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="default" className="rounded-full px-8 py-6 text-lg">
                <Link to="/features" className="flex items-center">
                  See All Features
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section bg-white">
          <div className="container mx-auto text-center">
            <h2 className="section-title fade-in">How It Works</h2>
            <div className="relative flex flex-col items-center justify-center py-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-24 h-24 rounded-lg ${steps[currentStep].color} flex items-center justify-center text-white shadow-xl mb-4`}
                  >
                    {Icon && <Icon size={40} />}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{steps[currentStep].title}</h3>
                  <p className="text-gray-600 max-w-xl">{steps[currentStep].description}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-4 mt-8">
                <Button onClick={handlePrev} variant="outline" className="rounded-full px-6 py-3 flex items-center">
                  <ArrowLeft className="mr-2" /> Previous
                </Button>
                <Button onClick={handleNext} variant="default" className="rounded-full px-6 py-3 flex items-center">
                  Next <ArrowRight className="ml-2" />
                </Button>
              </div>

              <div className="flex gap-2 justify-center mt-6">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full ${idx === currentStep ? 'bg-kitchance-navy-dark' : 'bg-gray-300'}`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                asChild
                variant="outline"
                className="rounded-full bg-white hover:bg-gray-50 border-2 border-kitchance-navy-dark text-kitchance-navy-dark px-8 py-6 text-lg"
              >
                <Link to="/how-it-works" className="flex items-center">
                  Learn More
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Index;
