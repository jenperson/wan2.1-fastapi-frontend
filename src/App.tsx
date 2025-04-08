import "./App.css";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  LinearProgress,
  TextField,
} from "@mui/material";
import NumberSelector from "./components/NumberSelector";

const App: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [negPrompt, setNegPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [frameCount, setFrameCount] = useState(33);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const addDefaultValues = () => {
    setPrompt(
      "An astronaut hatching from an egg, on the surface of the moon, the darkness and depth of space realized in the background. High quality, ultra-realistic detail and breath-taking movie-like camera shot",
    );
    setImageUrl(
      "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/astronaut.jpg",
    );
    setNegPrompt(
      "Bright tones, overexposed, static, blurred details, subtitles, style, works, paintings, images, static, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, misshapen limbs, fused fingers, still picture, messy background, three legs, many people in the background, walking backwards",
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    const endpoint = "/generate-video";

    if (!imageUrl || !prompt || prompt === "") {
      alert("Please enter an image URL and a prompt.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          image_url: imageUrl,
          negative_prompt: negPrompt,
          num_frames: frameCount,
        }),
      });

      if (!response.ok) {
        alert("Failed to start video generation job");
        throw new Error("Failed to start job");
      }

      const data = await response.json();
      const jobId = data.job_id;

      // Poll for job status
      const pollInterval = 5000; // 5 seconds
      const maxAttempts = 120; // 10 minutes
      let attempts = 0;

      const poll = async () => {
        attempts++;
        const statusResponse = await fetch(`${apiUrl}/status/${jobId}`);
        const statusData = await statusResponse.json();

        if (
          statusResponse.ok &&
          statusData.status === "completed" &&
          statusData.video_url
        ) {
          setVideoUrl(`${apiUrl}${statusData.video_url}`);
          setLoading(false);
        } else if (statusData.status === "error") {
          setLoading(false);
          alert("Error generating video");
        } else if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          setLoading(false);
          alert("Timed out waiting for video generation.");
        }
      };

      poll();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="result-container">
        {videoUrl && (
          <video controls className="mt-4 rounded-lg shadow-lg">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {loading && (
          <div>
            Video Generation in Progress!
            <LinearProgress />
          </div>
        )}
      </div>
      <div className="form-container">
        <Card>
          <CardContent>
            <div className="text-field">
              <TextField
                fullWidth
                label="Image URL"
                type="url"
                placeholder="Enter a URL to an image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="text-field">
              <TextField
                fullWidth
                label="Prompt"
                type="text"
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                multiline
              />
            </div>
            <div className="text-field">
              <TextField
                fullWidth
                label="Negative Prompt"
                id="outlined-multiline-static"
                rows={3}
                type="text"
                placeholder="(Optional) Enter a list of negative prompts, as in things that you do NOT want the video to contain."
                value={negPrompt}
                onChange={(e) => setNegPrompt(e.target.value)}
                multiline
              />
            </div>
            <div className="text-field">
              <NumberSelector
                value={frameCount}
                onChange={setFrameCount}
                label="Number of Frames"
                min={1}
                max={100}
              />
            </div>
            <div className="generate-btns">
              <Button
                variant="outlined"
                onClick={() => addDefaultValues()}
                disabled={loading}
              >
                Add Default Values
              </Button>
              <Button
                variant="contained"
                onClick={() => handleGenerate()}
                disabled={loading}
              >
                Generate Video
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
