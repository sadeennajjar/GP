import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StepCard from '@/components/StepCard';

const HowItWorks = () => {
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
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in text-primary">How KitChance Works</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 fade-in">
              A simple 4-step process to transform your kitchen from concept to visualization.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="section bg-card text-card-foreground">
          <div className="container mx-auto">
            <StepCard
              number={1}
              title="Cook with Remy"
              description="Start by having a conversation with Remy, our AI kitchen design assistant. Tell Remy about your style preferences, must-have features, color schemes, and any specific requirements. The more details you share, the better Remy can understand your vision."
              image="/images/remy-eating-moment-ratatouille-o6pcu5760bhw2te6.gif"
            />

            <div className="flex justify-center my-8">
              <div className="w-0.5 h-16 bg-primary opacity-50"></div>
            </div>

            <StepCard
              number={2}
              title="Upload Your Current Kitchen"
              description="Take photos of your current kitchen from multiple angles and upload them to KitChance. Remy will analyze the layout, dimensions, and structural elements to understand the space you're working with. This helps create realistic designs that fit your existing space."
              image="/images/emoty_generation.jpg"
            />

            <div className="flex justify-center my-8">
              <div className="w-0.5 h-16 bg-primary opacity-50"></div>
            </div>

            <StepCard
              number={3}
              title="Get Personalized Design Suggestions"
              description="Based on your conversation and uploaded photos, Remy will generate personalized design suggestions tailored to your preferences and space constraints. You'll receive multiple options with different layouts, color schemes, cabinet styles, and material selections."
              image="/images/generated_image.jpg"
            />

            <div className="flex justify-center my-8">
              <div className="w-0.5 h-16 bg-primary opacity-50"></div>
            </div>

            <StepCard
              number={4}
              title="Visualize Your New Kitchen in 2D and 3D"
              description="Explore your kitchen designs in both 2D floor plans and immersive 3D visualizations. You can virtually walk through your new kitchen, examine details from any angle, and even make real-time adjustments. This gives you a realistic preview of how your kitchen will look before any renovation begins."
              video="/images/kitchenvideo.mp4"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section bg-popover text-foreground">
          <div className="container mx-auto">
            <h2 className="section-title fade-in text-primary">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "How accurate are the 3D visualizations?",
                  answer: "Our 3D visualizations are highly accurate and rendered in photorealistic quality. They reflect real-world lighting, textures, and dimensions based on the photos you upload of your current space."
                },
                {
                  question: "Can I make changes to the designs Remy suggests?",
                  answer: "Absolutely! You can request modifications by simply telling Remy what you'd like to change. Remy will generate new designs based on your feedback, creating an iterative design process until you're completely satisfied."
                },
                {
                  question: "How long does the whole process take?",
                  answer: "The initial design concepts are generated within minutes of your conversation with Remy and photo uploads. Refining the designs based on your feedback might take a few iterations, but the entire process is significantly faster than traditional design services."
                },
                {
                  question: "Can Remy help me stay within my budget?",
                  answer: "Yes! Share your budget with Remy, and the designs will incorporate materials and layouts that fit within your financial constraints while still achieving your design goals."
                },
                {
                  question: "Can I use KitChance for other rooms besides the kitchen?",
                  answer: "Currently, KitChance specializes in kitchen designs, as Remy has been extensively trained on kitchen layouts, materials, and functionality. We plan to expand to other rooms in the future."
                }
              ].map(({ question, answer }, i) => (
                <div key={i} className="mb-8 fade-in">
                  <h3 className="text-xl font-semibold mb-2">{question}</h3>
                  <p className="text-muted-foreground">{answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="section bg-gradient-to-br from-primary to-secondary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 inline-block bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent bg-[length:200%_100%] animate-text-shine">
              Ready to Start Your Kitchen Transformation?
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto mb-8 fade-in">
              Join thousands of homeowners who have already reinvented their kitchens with Remy's help.
            </p>
            <a
              href="/features"
              className="inline-block bg-background text-primary font-bold py-4 px-8 rounded-full text-lg hover:bg-popover transition-colors hover:shadow-lg"
            >
              Start Designing Now
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HowItWorks;
