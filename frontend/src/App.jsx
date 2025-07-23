import React from "react";
import { useState } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([
    "What is global warming?",
    "List renewable sources of energy.",
    "Define greenhouse effect."
  ]);
  const [clusters, setClusters] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCluster = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cluster/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questions: questions })
      });

      const data = await response.json();
      setClusters(data.clusters);
    } catch (error) {
      console.error('Error fetching clusters:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Question Clustering App</h1>

      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={6}
        value={questions.join('\n')}
        onChange={(e) => setQuestions(e.target.value.split('\n'))}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleCluster}
      >
        {loading ? 'Clustering...' : 'Cluster Questions'}
      </button>

      {clusters && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Clustering Result:</h2>
          <div className="bg-gray-100 p-4 rounded">
            {Object.entries(clusters).map(([clusterName, clusterQuestions], index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-blue-700">{clusterName}</h3>
                <ul className="list-disc list-inside">
                  {clusterQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
