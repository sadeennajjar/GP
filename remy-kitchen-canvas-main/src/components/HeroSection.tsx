import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gradient-to-br from-white to-kitchance-blue-pale/50">
      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-kitchance-blue-light/20 animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-10 w-20 h-20 rounded-full bg-kitchance-blue-medium/20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-40 left-20 w-24 h-24 rounded-full bg-kitchance-navy-dark/20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative inline-block overflow-hidden">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-kitchance-navy-dark via-kitchance-blue-medium to-kitchance-teal bg-[length:200%_200%] animate-gradient-move">
                Design Your Dream Kitchen with Remy!
              </h1>
              {/* Shine Effect */}
              <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-white/30 transform rotate-12 animate-shine"></span>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Talk to Remy, share your ideas, and watch your kitchen come to life. Our AI assistant makes kitchen design interactive and fun!
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild variant="default" className="rounded-full text-lg px-8 py-6 transition-all duration-300 hover:shadow-lg group">
                <Link to="/features" className="flex items-center">
                  Start Designing
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full text-lg px-8 py-6 border-2 border-kitchance-navy-dark text-kitchance-navy-dark hover:bg-kitchance-blue-pale/50">
                <Link to="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-kitchance-navy-dark/20 to-kitchance-blue-medium/20 rounded-2xl transform rotate-3"></div>
              <img 
                src="/images/lets-design-together.png" 
                alt="Let's Design Together" 
                className="rounded-2xl shadow-lg relative z-10 object-cover w-full h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
