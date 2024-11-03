const axios = require('axios');
const fs = require('fs');
const path = require('path');
const QRCodeModel = require('../models/qrCodeModel');

const qrFolderPath = path.join(__dirname, '../uploads/qrs_download');

// Ensure the 'qrs_download' folder exists, or create it
if (!fs.existsSync(qrFolderPath)) {
  fs.mkdirSync(qrFolderPath);
}

const generateQRCode = async (req, res) => {
  const {
    data,
    size,
    file,
    dynamic,
    redirectUrl,
    body,
    eye,
    eyeBall,
    bodyColor,
    bgColor,
    eye1Color,
    eye2Color,
    eye3Color,
    logo,
  } = req.body;

  console.log('Received data:', req.body);

  // Validate the type of file to be one of the accepted formats
  const acceptedFileTypes = ['png', 'jpg', 'jpeg'];
  const fileType = file && acceptedFileTypes.includes(file.toLowerCase()) ? file.toLowerCase() : 'png';

  try {
    // Custom config for QR code styling from frontend
    const qrConfig = {
      body: body || "square",
      eye: eye || "frame0",
      eyeBall: eyeBall || "ball0",
      bodyColor: bodyColor || "#000000",
      bgColor: bgColor || "#ffffff",
      eye1Color: eye1Color || "#000000",
      eye2Color: eye2Color || "#000000",
      eye3Color: eye3Color || "#000000",
      logo: logo || ""
    };

    // Call the QR Code API
    const response = await axios.post(
      'https://api.qrcode-monkey.com/qr/custom',
      {
        data,
        config: qrConfig,
        size,
        file: fileType,
      },
      { responseType: 'arraybuffer' }
    );

    // Create a file path for the generated QR code
    const fileName = `qr_code_${Date.now()}.${fileType}`;
    const filePath = path.join(qrFolderPath, fileName);

    // Save the QR code image to the server
    fs.writeFileSync(filePath, response.data);

    // Create a QR Code document in the database
    const qrCode = new QRCodeModel({
      data,
      config: qrConfig,
      size,
      fileType,
      dynamic,
      redirectUrl: dynamic ? redirectUrl : undefined,
      filePath,
    });

    await qrCode.save();

    res.json({ filePath: `/uploads/qrs_download/${fileName}` });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

module.exports = { generateQRCode };
