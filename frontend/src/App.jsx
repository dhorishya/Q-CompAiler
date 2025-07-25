import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [questions, setQuestions] = useState("");
  const [clusters, setClusters] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ocr/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.text) {
        setOcrText(data.text);
        setQuestions(data.text);
      } else {
        alert("OCR failed. Try another file.");
      }
    } catch (error) {
      console.error("OCR error:", error);
      alert("OCR request failed.");
    }
  };

  const handleCluster = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/cluster/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: questions.split("\n") }),
      });
      const data = await response.json();
      setClusters(data.clusters);
    } catch (error) {
      console.error("Clustering failed:", error);
      alert("Failed to cluster questions.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">Question Analyzer</h1>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col space-y-2">
            <label className="font-semibold text-gray-700">Upload Image or PDF</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring focus:outline-none"
            />
          </div>
          <button
            onClick={handleUpload}
            className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
          >
            Scan with OCR
          </button>
        </div>

        <div>
          <label className="font-semibold text-gray-700 block mb-2">Edit / Write Questions:</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 h-40 resize-y focus:outline-none focus:ring"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Type or edit your questions here..."
          />
        </div>

        <div className="text-center">
          <button
            onClick={handleCluster}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
          >
            {loading ? "Clustering..." : "Cluster Questions"}
          </button>
        </div>

        {clusters && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Clustering Result:</h2>
            {Object.entries(clusters).map(([clusterName, clusterQuestions], index) => (
              <div key={index} className="mb-4 bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-semibold text-indigo-700">
                  {clusterName} ({clusterQuestions.length})
                </h3>
                <ul className="list-disc list-inside mt-2">
                  {clusterQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
