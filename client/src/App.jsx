// frontend/src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    try {
      const response = await axios.post("http://localhost:3000/analyze", {
        text,
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing text:", error);
    }
  };

  return (
    <div className="App">
      <h1>NLP Writing Assistant</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        rows={10}
        cols={50}
      />
      <br />
      <button onClick={handleAnalyze}>Analyze</button>
      {analysis && (
        <div>
          <h2>Analysis Results:</h2>
          <p>Word Count: {analysis.wordCount}</p>
          <p>Sentence Count: {analysis.sentenceCount}</p>
          <p>Tokens: {analysis.tokens.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default App;
