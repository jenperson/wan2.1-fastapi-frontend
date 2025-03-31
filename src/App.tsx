import './App.css'
import React, { useState } from "react";
import { Button, Card, CardContent, TextField } from '@mui/material';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleGenerate = async (type: "image" | "video") => {
    setLoading(true);
    const endpoint = type === "image" ? "/generate-image" : "/generate-video";

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate media");
      }

      const data = await response.json();
      if (type === "image") setImageUrl(data.url);
      if (type === "video") setVideoUrl(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="result-container">
        {imageUrl && (
          <img src={imageUrl} alt="Generated" className="mt-4 rounded-lg shadow-lg" />
        )}
        {videoUrl && (
          <video controls className="mt-4 rounded-lg shadow-lg">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="form-container">
      <Card>
        <CardContent>
          <TextField
            type="text"
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleGenerate("image")} disabled={loading}>Generate Image</Button>
            <Button onClick={() => handleGenerate("video")} disabled={loading}>Generate Video</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
