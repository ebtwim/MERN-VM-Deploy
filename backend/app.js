const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const port = process.env.PORT || 6200;

const currencyRoutes = require('./routes/CurrencyRoutes');
const apiPath = '/api';

// ✅ MongoDB connection
const MONGO_URL = process.env.MONGO_URL || 
  "mongodb://appuser:Str0ng_Pass_ChangeMe@mongodb:27017/appdb?authSource=admin";

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
})
.catch(err => {
  console.error("❌ MongoDB error: ", err);
  process.exit(1);
});

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.use(apiPath, currencyRoutes);

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ✅ HTTP + Socket.io setup
const server = http.createServer(app);
const io = socketIo(server);
const POLYGON_API = process.env.POLYGON_SECRET;

// Socket.io connection and listener
io.on('connection', socket => {
  console.log('New client connected');
  setInterval(() => sockConnect(socket), 2000);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Get latest Bid/Ask quote from Polygon.io and emit to 'rate stream' channel
const sockConnect = async socket => {
  try {
    const response = await axios.get(
      'https://api.polygon.io/v1/last_quote/currencies/EUR/USD?apiKey=' + POLYGON_API
    );
    socket.emit('rate stream', response.data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

// Start server
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${port}`);
});
