const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const qrRoutes = require('./routes/qrRoutes');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
connectDB(); 

// Mount QR routes
app.use(qrRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

