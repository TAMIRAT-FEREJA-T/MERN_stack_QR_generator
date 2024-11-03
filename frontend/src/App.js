import React, { useState } from 'react';
import axios from 'axios';

function QRCodeApp() {
  const [qrData, setQrData] = useState({
    data: '',
    body: 'square',
    eye: 'frame0',
    eyeBall: 'ball0',
    bodyColor: '#000000',
    bgColor: '#ffffff',
    eye1Color: '#000000',
    eye2Color: '#000000',
    eye3Color: '#000000',
    logo: '',
    size: 300,
    file: 'png',
    dynamic: false,
    redirectUrl: '',
  });
  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'QRCode.png'; // Set the filename
      link.click();
  
      // Clean up the blob URL to free memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleChange = (e) => {
    setQrData({ ...qrData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/generate-qr', qrData);
      setQrCodeUrl(`http://localhost:5000${response.data.filePath}`);
    } catch (err) {
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">QR Code Generator</h1>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-600">QR Data (Text or URL)</label>
            <input
              type="text"
              name="data"
              value={qrData.data}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">Body Style</label>
              <select
                name="body"
                value={qrData.body}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 transition duration-200"
              >
                <option value="square">Square</option>
                <option value="mosaic">Mosaic</option>
                <option value="dot">Dot</option>
                <option value="circle">Circle</option>
                <option value="star">Star</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Eye Style</label>
              <select
                name="eye"
                value={qrData.eye}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 transition duration-200"
              >
                <option value="frame0">Frame 0</option>
                <option value="frame1">Frame 1</option>
                <option value="frame2">Frame 2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">Body Color</label>
              <input
                type="color"
                name="bodyColor"
                value={qrData.bodyColor}
                onChange={handleChange}
                className="mt-1 block w-full  rounded-lg border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Background Color</label>
              <input
                type="color"
                name="bgColor"
                value={qrData.bgColor}
                onChange={handleChange}
                className="mt-1 block w-full  rounded-lg border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="inline-flex items-center mt-3">
              <input
                type="checkbox"
                name="dynamic"
                checked={qrData.dynamic}
                onChange={(e) => setQrData({ ...qrData, dynamic: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-500 transition duration-200"
              />
              <span className="ml-2 text-sm text-gray-600">Dynamic QR Code</span>
            </label>
          </div>

          {qrData.dynamic && (
            <div>
              <label className="text-sm font-semibold text-gray-600">Redirect URL</label>
              <input
                type="url"
                name="redirectUrl"
                value={qrData.redirectUrl}
                onChange={handleChange}
                className="mt-1 block w-full p-3 rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 transition duration-200"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300"
          >
            {loading ? 'Generating...' : 'Generate QR Code'}
          </button>
        </form>

        {error && <p className="text-red-600 text-center mt-6">{error}</p>}

        {qrCodeUrl && (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Your QR Code:</h2>
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto transition-transform duration-300 hover:scale-110" />
            <button onClick={handleDownload}
             
              className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 shadow-lg"
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRCodeApp;
