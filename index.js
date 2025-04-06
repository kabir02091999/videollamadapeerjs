const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración optimizada para Render
const peerServer = PeerServer({
  port: process.env.PEER_PORT || 9000,
  path: '/myapp',
  proxied: true, // CRUCIAL para Render
  ssl: process.env.NODE_ENV === 'production' // SSL en producción
});

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor HTTP en puerto ${PORT}`);
  console.log(`✅ PeerServer en puerto ${process.env.PEER_PORT || 9000}`);
});