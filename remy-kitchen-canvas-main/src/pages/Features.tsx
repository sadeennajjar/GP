import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  MonitorUp,
  UploadCloud,
  PaintBucket,
  Sparkles,
  Smartphone,
  Wallpaper,
  Save,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Features = () => {
  const coreFeatures = [
    {
      icon: Mic,
      title: "Voice Interaction",
      desc: "Talk naturally with Remy, describing your kitchen vision in your own words.",
      badge: "AI-powered",
    },
    {
      icon: MonitorUp,
      title: "2D & 3D Generation",
      desc: "Visualize your kitchen from every angle with realistic 2D layouts and immersive 3D renderings.",
      badge: "Visualizer",
    },
    {
      icon: UploadCloud,
      title: "Upload Your Space",
      desc: "Start your design journey by uploading photos of your current kitchen. Remy will analyze and adapt.",
      badge: "Smart Scan",
    },
    {
      icon: PaintBucket,
      title: "Personalized Designs",
      desc: "Receive tailor-made design options based on your taste, space, and budget.",
      badge: "Tailored",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const fadeElements = document.querySelectorAll(".fade-in");
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in text-primary">
              Powerful Features for Your Dream Kitchen
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 fade-in">
              KitChance combines cutting-edge AI with intuitive design to make your kitchen journey magical.
            </p>

            <Button asChild className="rounded-full bg-kitchance-navy-dark text-white hover:bg-kitchance-blue-medium transition px-8 py-4 text-lg">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Remy Message */}
        <div className="flex items-center gap-0 justify-center fade-in bg-white/30 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg mt-10">
          <img
            src="/images/remy-waving.png"
            alt="Remy talking"
            className="w-20 h-20 md:w-[500px] md:h-[500px] object-contain -mr-2"
          />
          <p className="text-xl text-gray-600 font-semibold italic">
            “I can’t wait to hear your ideas and help you design something amazing!”
            <span className="font-bold text-kitchance-navy-dark"> – Remy</span>
          </p>
        </div>

        {/* Core Features */}
        <section className="section bg-card text-card-foreground">
          <div className="container mx-auto">
            <h2 className="section-title fade-in text-primary">Core Features</h2>
            <div className="space-y-12">
              {coreFeatures.map(({ icon: Icon, title, desc, badge }, i) => {
                const boxColors = [
                  "bg-kitchance-navy-dark",
                  "bg-kitchance-navy",
                  "bg-kitchance-navy-light",
                  "bg-kitchance-navy-ultralight",
                ];
                const boxColor = boxColors[i] || "bg-kitchance-navy-light";

                return (
                  <div
                    key={i}
                    className={`flex flex-col md:flex-row ${
                      i % 2 === 1 ? "md:flex-row-reverse" : ""
                    } items-center gap-6 fade-in p-6 rounded-2xl shadow-md hover:scale-[1.02] hover:shadow-lg transition duration-300 ${boxColor} max-w-4xl mx-auto`}
                  >
                    <div className="flex-shrink-0">
                      <div className="p-4 rounded-full bg-white shadow">
                        <Icon className="w-10 h-10 text-kitchance-navy-dark" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-white font-bold uppercase tracking-wide">{badge}</div>
                      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
                      <p className="text-white/90 max-w-md">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="section bg-white">
          <div className="container mx-auto">
            <h2 className="section-title fade-in text-primary">Advanced Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[Sparkles, Smartphone, Wallpaper, Save].map((Icon, i) => {
                const titles = [
                  "Smart Suggestions",
                  "Mobile Friendly",
                  "Material Library",
                  "Save & Share"
                ];
                const badges = ["Trending", "Responsive", "Huge!", "Flexible"];
                const descriptions = [
                  "Remy gives intelligent layout and style ideas based on your space and preferences.",
                  "Access and design your kitchen easily from any device, wherever you are.",
                  "Choose from a wide range of materials, finishes, and textures in one place.",
                  "Save your favorite designs and share them with your family or designer instantly."
                ];

                return (
                  <div
                    key={i}
                    className="relative p-6 rounded-xl shadow-md fade-in bg-kitchance-blue-light/10 hover:shadow-lg transition duration-300"
                  >
                    <div className="absolute top-3 right-3 text-xs bg-kitchance-teal text-white px-2 py-1 rounded-full shadow-sm">
                      {badges[i]}
                    </div>
                    <div className="mb-4">
                      <Icon className="w-8 h-8 text-kitchance-navy-dark" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{titles[i]}</h3>
                    <p className="text-muted-foreground">{descriptions[i]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Features;
