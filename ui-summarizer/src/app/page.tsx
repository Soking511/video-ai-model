"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [prompt, setPrompt] = useState("Summarize this video in key points");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl.trim()) {
      setError("Please enter a video URL");
      return;
    }

    setIsLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await axios.post("http://localhost:5000/api/summarize", {
        video_url: videoUrl,
        prompt: prompt,
      });

      if (response.data.success) {
        setSummary(response.data.summary);
      } else {
        setError(response.data.error || "Failed to summarize video");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Video AI Summarizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform long videos into concise summaries using advanced AI
            technology
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="videoUrl"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Video URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Custom Prompt (Optional)
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe how you want the video summarized..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Video...
                  </>
                ) : (
                  "Summarize Video"
                )}
              </button>
            </form>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Summary Display */}
          {summary && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Video Summary
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {summary}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Paste Video URL
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simply paste any YouTube, Vimeo, or other video platform URL
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI extracts key frames and analyzes the video content
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Get Summary
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive a comprehensive summary in your preferred language
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
