import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  const handleStartRemy = () => {
    console.log("🚀 Navigating to /remy-active from Contact page...");
    navigate("/auth");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-kitchance-blue-pale/20 to-kitchance-blue-light/10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-kitchance-navy-dark mb-8 text-center">
          Start Designing with Remy!
        </h1>

        <Button
          onClick={handleStartRemy}
          className="bg-kitchance-navy-dark hover:bg-kitchance-blue-deep text-white font-bold py-4 px-10 rounded-full text-lg transition-all hover:shadow-lg"
        >
          🎤 Start Talking to Remy
        </Button>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
