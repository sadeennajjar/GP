import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const RemyResult = () => {
  const location = useLocation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const imagePath = params.get("image");

    if (imagePath) {
      const fullUrl = `https://8910-213-192-2-87.ngrok-free.app/generated-image?path=${encodeURIComponent(imagePath)}`;
      setImageUrl(fullUrl);
    }
  }, [location.search]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center",    
        height: "100vh",         
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <h2>Your Kitchen is Ready 🎉</h2>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Generated Kitchen"
          style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "12px" }}
        />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default RemyResult;
