const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración optimizada para Render
const peerServer = PeerServer({
  port: process.env.PEER_PORT || 5000,
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
  console.log(`✅ http://localhost:${PORT}`);
  console.log(`✅ PeerServer en puerto ${process.env.PEER_PORT || 5000}`);
});

/* const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CRUCIAL para Render
const peerServer = PeerServer({
  port: process.env.PEER_PORT || 9000,
  path: '/myapp',
  proxied: true, // ABSOLUTAMENTE NECESARIO para Render
  ssl: process.env.NODE_ENV === 'production',
  allow_discovery: true,
  concurrent_limit: 5000,
  alive_timeout: 0 // Mantener conexiones activas indefinidamente
});

// Middleware esencial
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Ruta de verificación
app.get('/peerjs/health', (req, res) => {
  res.status(200).json({ status: 'active' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor HTTP: ${PORT}`);
  console.log(`✅ PeerJS Server: ${process.env.PEER_PORT || 9000}`);
}); */

/* const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración ESSENCIAL para Render
const peerServer = PeerServer({
  port: process.env.PEER_PORT || 9000,
  path: '/myapp',
  proxied: true, // CRUCIAL para Render
  allow_discovery: true,
  key: 'render-peerjs-key', // Añade seguridad básica
  ssl: process.env.NODE_ENV === 'production' // Habilita SSL en producción
});

// Middleware crítico para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de verificación de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', peerjs: 'active' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor HTTP en puerto ${PORT}`);
  console.log(`✅ PeerServer en puerto ${process.env.PEER_PORT || 9000}`);
}); */