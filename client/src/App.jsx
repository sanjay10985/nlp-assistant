import React, { useState } from "react";
import axios from "axios";
import { AlertTriangle, Loader, RefreshCw } from "lucide-react";
import AnalysisResults from "./components/analysis-resutls";

export default function App() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/analyze", {
        text,
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing text:", error);
      setError("An error occurred while analyzing the text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left side - User Input */}
      <div className="w-1/2 p-8 bg-white shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">NLP Writing Assistant</h1>
        <textarea
          className="w-full h-64 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
        />
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full flex items-center justify-center"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="animate-spin mr-2" />
          ) : (
            <RefreshCw className="mr-2" />
          )}
          {isLoading ? "Analyzing..." : "Analyze Text"}
        </button>
        {error && (
          <div className="mt-4 text-red-500 flex items-center">
            <AlertTriangle className="mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Right side - Analysis Results */}
      <div className="w-1/2 p-8 bg-gray-50 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Analysis Results</h2>
        {analysis ? (
          <AnalysisResults analysis={analysis} />
        ) : (
          <div className="text-gray-500 italic">
            Enter text and click "Analyze" to see results.
          </div>
        )}
      </div>
    </div>
  );
}
