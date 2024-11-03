const express = require('express');
const { generateQRCode } = require('../controllers/qrController');

const router = express.Router();

// Endpoint to generate QR code
router.post('/generate-qr', generateQRCode);

// Endpoint to serve QR code images
router.use('/uploads/qrs_download', express.static('uploads/qrs_download'));

module.exports = router;
