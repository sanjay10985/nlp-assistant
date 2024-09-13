import { useState } from "react";
import {
  getReadabilityDescription,
  getSentimentDescription,
} from "../utils/helper";
import { Info } from "lucide-react";

export default function AnalysisResults({ analysis }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ResultItem label="Word Count" value={analysis.wordCount} />
        <ResultItem label="Sentence Count" value={analysis.sentenceCount} />
        <ResultItem
          label="Sentiment"
          value={getSentimentDescription(analysis.sentiment)}
          score={analysis.sentiment.toFixed(2)}
        />
        <ResultItem
          label="Readability"
          value={getReadabilityDescription(
            analysis.readability.fleschReadingEase
          )}
          score={analysis.readability.fleschReadingEase.toFixed(1)}
        />
      </div>
      <KeyPhrases keyPhrases={analysis.keyPhrases} />
      <Suggestions suggestions={analysis.suggestions} />
      <POSTagging posTagging={analysis.posTagging} />
    </div>
  );
}

function KeyPhrases({ keyPhrases }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Key Phrases</h3>
      <div className="flex flex-wrap gap-2">
        {keyPhrases.map((phrase, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold"
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}

function Suggestions({ suggestions }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Writing Suggestions</h3>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
          >
            <p className="font-medium text-yellow-700">{suggestion.type}</p>
            <p className="text-yellow-600">{suggestion.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function POSTagging({ posTagging }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6">
      <h3
        className="font-semibold mb-2 flex items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Part-of-Speech Tagging</span>
        <Info className="ml-2" size={16} />
      </h3>
      {isExpanded && (
        <div className="bg-white p-4 rounded-lg shadow-inner">
          {posTagging.map((item, index) => (
            <span key={index} className="inline-block mr-2 mb-2">
              <span className="font-medium">{item.token}</span>
              <span className="text-xs text-gray-500 ml-1">({item.tag})</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultItem({ label, value, score }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-1 font-semibold text-gray-900 flex items-center">
        {value}
        {score && <span className="ml-2 text-sm font-normal">({score})</span>}
      </div>
    </div>
  );
}
