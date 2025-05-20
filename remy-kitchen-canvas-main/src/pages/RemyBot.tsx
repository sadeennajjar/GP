import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Vapi from "@vapi-ai/web";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useAnimation } from "framer-motion";

const RemyActive = () => {
  const vapiRef = useRef<Vapi | null>(null);
  const transcriptRef = useRef<string>("");
  const [transcriptDisplay, setTranscriptDisplay] = useState<string>("");
  const [isTalking, setIsTalking] = useState<boolean>(false);
  const micControls = useAnimation();
  const navigate = useNavigate();

  const triggerKitchenGeneration = async () => {
    const userTranscriptOnly = transcriptRef.current
      .split("\n")
      .filter((line) => line.startsWith("User:"))
      .map((line) => line.replace("User: ", "").trim())
      .join(" ")
      .trim();

    try {
      const res = await fetch("https://8910-213-192-2-87.ngrok-free.app/generate_kitchen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: userTranscriptOnly }),
      });

      const data = await res.json();

      if (data.image_url) {
        const imageUrl = data.image_url;
        navigate(`/remy-result?image=${encodeURIComponent(imageUrl)}`);
      } else {
        console.error("No image_url in response", data);
      }
    } catch (error) {
      console.error("Error generating kitchen:", error);
    }
  };

  const startRemy = async () => {
    if (!vapiRef.current || isTalking) return;

    transcriptRef.current = "";
    setTranscriptDisplay("");
    setIsTalking(true);

    vapiRef.current.on("call-start", () => {
      console.log("📞 Call started");
      setIsTalking(true);
    });

    vapiRef.current.on("call-end", () => {
      console.log("📴 Call ended");
      setIsTalking(false);

      setTimeout(() => {
        triggerKitchenGeneration();
      }, 1000);
    });

    vapiRef.current.on("message", (msg) => {
      if (msg.type === "transcript") {
        const speaker = msg.role === "user" ? "User" : "Remy";
        const line = `${speaker}: ${msg.transcript}`;
        transcriptRef.current += line + "\n";
        setTranscriptDisplay(transcriptRef.current.trim());
      }
    });

    vapiRef.current.on("volume-level", (volume) => {
      micControls.start({
        scale: 1 + Math.min(volume * 2, 0.5),
        transition: { duration: 0.1, ease: "easeOut" },
      });
    });

    await vapiRef.current.start("a847752d-9809-4745-a614-b44d90a7daec");
  };

  const stopRemy = () => {
    vapiRef.current?.stop();
    setIsTalking(false);

    const userTranscriptOnly = transcriptRef.current
      .split("\n")
      .filter((line) => line.startsWith("User:"))
      .map((line) => line.replace("User: ", "").trim())
      .join(" ")
      .trim();

    if (userTranscriptOnly.length > 5) {
      navigate(`/remy-loading?transcript=${encodeURIComponent(userTranscriptOnly)}`);
    } else {
      console.warn("Transcript too short.");
    }
  };

  useEffect(() => {
    if (!vapiRef.current) {
      console.log("🧠 Initializing Vapi...");
      vapiRef.current = new Vapi("aa5b21bd-2199-423d-b1c1-83a9c3ab740a");
    }
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ padding: "4rem 2rem", textAlign: "center", background: "#f4f6fc", minHeight: "80vh" }}>
        <motion.img
          animate={micControls}
          initial={{ scale: 1 }}
          src="/images/remy-with-spoon.png"
          alt="Remy listening"
          className="w-48 h-48 object-contain mx-auto"
          style={{ opacity: isTalking ? 1 : 0.4 }}
        />

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          {isTalking ? "🎤 Remy is listening..." : "🛑 Remy is not listening yet."}
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: "2rem" }}>
          Describe your dream kitchen and Remy will bring it to life!
        </Typography>

        {!isTalking ? (
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={startRemy} sx={{ mb: 2 }}>
            Start Talking to Remy
          </Button>
        ) : (
          <Button variant="outlined" color="error" startIcon={<StopIcon />} onClick={stopRemy} sx={{ mb: 2 }}>
            Stop Talking
          </Button>
        )}

        {transcriptDisplay && (
          <Box
            sx={{
              background: "#fff",
              padding: "1rem 2rem",
              borderRadius: "8px",
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
              maxWidth: "700px",
              margin: "0 auto",
              fontStyle: "italic",
              color: "#333",
              whiteSpace: "pre-line",
              mt: 3,
            }}
          >
            {transcriptDisplay}
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default RemyActive;
