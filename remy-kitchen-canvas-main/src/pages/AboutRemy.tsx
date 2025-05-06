import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  BrainCircuit,
  Sparkles,
  Heart,
  MessageCircle,
  Clock,
  Lightbulb,
} from 'lucide-react';

const AboutRemy = () => {
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

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-background text-foreground font-poppins">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary/10 to-accent/10 py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
                  Meet Remy, Your Kitchen Design Assistant
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Remy is your friendly AI kitchen designer, inspired by creativity and innovation.
                  Remy listens, understands, and creates a kitchen that's uniquely yours.
                </p>
                <Button
                  asChild
                  className="rounded-full bg-primary hover:bg-secondary px-8 py-6 text-lg text-primary-foreground"
                >
                  <a href="/features">Start Designing with Remy</a>
                </Button>
              </div>
              <div className="fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-secondary/20 rounded-full transform rotate-3"></div>
                  <div className="relative z-10 bg-white rounded-full p-6 shadow-xl">
                    <div className="w-60 h-60 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-primary bg-white">
                      <img
                        src="/images/REMY_talking.gif"
                        alt="Remy Talking"
                        className="w-full h-full object-cover scale-125 object-center"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-8 right-0 bg-white rounded-full p-3 shadow-lg animate-bounce-light">
                    <Sparkles size={32} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Remy's Story */}
        <section className="section bg-card text-card-foreground">
          <div className="container mx-auto">
            <h2 className="section-title fade-in text-primary">Remy's Story</h2>
            <div className="max-w-3xl mx-auto text-lg text-muted-foreground space-y-6 fade-in">
              <p>
                Remy was created by a team of kitchen design experts, AI specialists, and interior decorators...
              </p>
              <p>Trained on thousands of kitchen designs...</p>
              <p>Unlike static design software, Remy evolves with each interaction...</p>
              <p>Today, Remy has helped thousands of homeowners transform their kitchens...</p>
            </div>
          </div>
        </section>

        {/* Remy's Capabilities */}
        <section className="section bg-kitchance-blue-pale text-foreground">
          <div className="container mx-auto">
            <h2 className="section-title fade-in text-primary">What Makes Remy Special</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: BrainCircuit, title: 'AI-Powered Analysis' },
                { icon: Heart, title: 'Intuitive Understanding' },
                { icon: MessageCircle, title: 'Natural Conversation' },
                { icon: Clock, title: 'Instant Visualization' },
                { icon: Lightbulb, title: 'Creative Problem-Solving' },
                { icon: Sparkles, title: 'Trend-Aware Design' },
              ].map(({ icon: Icon, title }, i) => (
                <div
                  key={i}
                  className="bg-card p-8 rounded-2xl shadow-md fade-in"
                >
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{title}</h3>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer nec odio. Praesent libero.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Remy's Design Process */}
        <section className="section bg-card text-card-foreground">
          <div className="container mx-auto">
            <h2 className="section-title fade-in text-primary">
              How Remy Designs Your Kitchen
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-primary/30 rounded-full"></div>
                {[
                  'Listening and Learning',
                  'Spatial Analysis',
                  'Ideation Phase',
                  'Refinement Through Feedback',
                  'Detailed Visualization',
                ].map((title, i) => (
                  <div
                    key={i}
                    className="relative pl-20 mb-12 fade-in"
                  >
                    <div className="absolute left-6 w-6 h-6 bg-primary rounded-full transform -translate-x-1/2"></div>
                    <h3 className="text-xl font-semibold mb-3">{title}</h3>
                    <p className="text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Integer nec odio. Praesent libero.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>



      </main>
      <Footer />
    </>
  );
};

export default AboutRemy;
