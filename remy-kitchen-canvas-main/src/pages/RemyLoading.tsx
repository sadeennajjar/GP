import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const RemyLoadingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transcript = searchParams.get("transcript");

  useEffect(() => {
    const generateImage = async () => {
      if (!transcript || transcript.split(" ").length < 5) {
        console.warn("Transcript too short or missing.");
        navigate("/remy");
        return;
      }

      try {
        const response = await fetch("https://d28c-94-249-51-113.ngrok-free.app/transcript", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript }),
        });

        const data = await response.json();

        if (response.ok && data.image_url) {
          navigate(`/KitchenResult?image=${encodeURIComponent(data.image_url)}`);
        } else {
          console.error("Backend error:", data);
          navigate("/remy");
        }
      } catch (err) {
        console.error("Generation failed:", err);
        navigate("/remy");
      }
    };

    generateImage();
  }, [transcript, navigate]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: "6rem 2rem",
          background: "#f4f6fc",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 4 }}>
          Hang tight while Remy cooks up your dream kitchen...
        </Typography>

        <img
          src="/images/remycooking.gif"
          alt="Remy Cooking"
          style={{
            width: "400px",
            maxWidth: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Box>
      <Footer />
    </>
  );
};

export default RemyLoadingPage;
