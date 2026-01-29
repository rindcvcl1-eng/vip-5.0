// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');

const diceEngine = require('./game/diceEngine');
const stockEngine = require('./game/stockEngine');
const aiDealer = require('./game/aiDealer');
const db = require('./db/mockDB');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// socket.io real-time
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  // join room for global updates
  socket.on('join', (payload) => {
    socket.join('global');
  });

  socket.on('placeBet', async (payload) => {
    // payload: { userId, amount, betType } betType: 'tai'|'xiu'
    const result = await diceEngine.placeBet(payload, io, db);
    socket.emit('betResult', result);
  });

  socket.on('buyStock', async (payload) => {
    const res = stockEngine.buyStock(payload, db, io);
    socket.emit('buyStockResult', res);
  });

  socket.on('sellStock', async (payload) => {
    const res = stockEngine.sellStock(payload, db, io);
    socket.emit('sellStockResult', res);
  });
});

// start background engines
diceEngine.startPeriodicRoll(io, db); // handles 3-minute cycle roll logic for table
stockEngine.startStockFluctuation(io, db); // 5-minute stock change
aiDealer.startAI(io, db); // AI buy/sell actions every 10 minutes

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
