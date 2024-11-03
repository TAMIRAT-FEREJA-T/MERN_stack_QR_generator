const mongoose = require('mongoose');

// QR Code Schema for storing dynamic QR data
const qrCodeSchema = new mongoose.Schema({
  data: String,
  config: Object,
  size: Number,
  fileType: String,
  dynamic: Boolean, 
  redirectUrl: String, 
  filePath: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const QRCodeModel = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCodeModel;
