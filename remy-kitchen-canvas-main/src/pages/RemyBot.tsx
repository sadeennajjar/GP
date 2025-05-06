import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Vapi from "@vapi-ai/web";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useAnimation } from "framer-motion";

const RemyActive = () => {
  const vapiRef = useRef<Vapi | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isTalking, setIsTalking] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const micControls = useAnimation();
  const hasGenerated = useRef(false);

  console.log("🆕 RemyActive component loaded");

  const triggerGeneration = async () => {
    console.log("✅ TriggerGeneration called");
    console.log("🧾 Transcript before clean:", transcript);

    const cleanTranscript = transcript.trim();
    const wordCount = cleanTranscript.split(" ").length;

    console.log("📏 Word count:", wordCount);

    if (!cleanTranscript || wordCount < 10) {
      console.warn("⛔ Transcript too short (<10 words), skipping");
      return;
    }

    if (hasGenerated.current) {
      console.warn("⛔ Already generated this session");
      return;
    }

    hasGenerated.current = true;

    try {
      const response = await fetch("https://1f41-86-108-13-69.ngrok-free.app/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: cleanTranscript }),
      });

      const data = await response.json();
      console.log("📥 Backend response:", data);

      if (response.ok && data.image_url) {
        setImageUrl(data.image_url);
        console.log("✅ Received image URL:", data.image_url);
      } else {
        console.error("❌ Backend error or no image_url:", data);
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    }
  };

  const startRemy = async () => {
    console.log("▶️ Starting Remy...");
    if (!vapiRef.current) return;

    if (isTalking) {
      console.warn("⚠️ Already in call");
      return;
    }

    hasGenerated.current = false;
    setTranscript("");
    setImageUrl("");
    setIsTalking(true);

    vapiRef.current.on("call-start", () => {
      console.log("📞 Call started");
      setIsTalking(true);
    });

    vapiRef.current.on("call-end", () => {
      console.log("📴 Call ended");
      setIsTalking(false);

      setTimeout(() => {
        const cleaned = transcript.trim();
        console.log("📜 Final transcript after delay:", cleaned);
        console.log("📏 Word count:", cleaned.split(" ").length);
        triggerGeneration();
      }, 5000);
    });

    vapiRef.current.on("message", (msg) => {
      console.log("💬 Message:", msg.role, msg.transcript);
      if (msg.type === "transcript" && msg.role === "user") {
        setTranscript((prev) => {
          const updated = prev + " " + msg.transcript;
          console.log("📝 User transcript updated:", updated.trim());
          return updated;
        });
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
    console.log("🛑 Stopping Remy...");
    vapiRef.current?.stop();
    setIsTalking(false);
  };

  useEffect(() => {
    if (vapiRef.current) return;
    console.log("🧠 Initializing Vapi...");
    vapiRef.current = new Vapi("aa5b21bd-2199-423d-b1c1-83a9c3ab740a");
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

        <Button
          onClick={triggerGeneration}
          variant="outlined"
          sx={{ mb: 2, ml: 2 }}
          color="secondary"
        >
          🧪 Force Generation
        </Button>

        {transcript && (
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
            }}
          >
            {transcript.trim()}
          </Box>
        )}

        {imageUrl && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              🖼️ Your Dream Kitchen:
            </Typography>
            <img
              src={imageUrl}
              alt="Generated Kitchen"
              style={{
                width: "100%",
                maxWidth: "700px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default RemyActive;
