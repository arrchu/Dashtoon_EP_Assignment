import React, { useState } from 'react';
import './App.css';

const ComicStripGenerator = () => {
  const [inputs, setInputs] = useState(Array(10).fill(''));
  const [comicPanels, setComicPanels] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateComic = async () => {
    try {
      setLoading(true);

      const generatedPanels = await Promise.all(
        inputs.map(async (input) => {
          const imageBlob = await query({ inputs: input });
          const imageUrl = URL.createObjectURL(imageBlob);
          return imageUrl;
        })
      );

      setComicPanels(generatedPanels);
    } catch (error) {
      console.error('Error generating comic:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Comic Strip Generator</h1>
      <div className="ComicForm">
        {inputs.map((input, index) => (
          <div key={index} className="ComicPanel">
            <textarea
              value={input}
              onChange={(e) => {
                const newInputs = [...inputs];
                newInputs[index] = e.target.value;
                setInputs(newInputs);
              }}
              placeholder={`Panel ${index + 1}`}
            />
            {comicPanels[index] && (
              <img src={comicPanels[index]} alt={`Panel ${index + 1}`} />
            )}
          </div>
        ))}
        <button onClick={generateComic} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Comic'}
        </button>
      </div>
    </div>
  );
};

async function query(data) {
  const response = await fetch("https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud", {
    method: "POST",
    headers: {
      "Accept": "image/png",
      "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to generate comic panel');
  }

  return await response.blob();
}

export default ComicStripGenerator;
