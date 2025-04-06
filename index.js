const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');

const app = express();
const PORT =  process.env.PORT || 3000;

// Configuración optimizada para PeerJS 1.0.2
const peerServer = PeerServer({
  port:  10001,
  path: '/myapp',
  proxied: true,  // Necesario si usas proxy/reverse proxy
  allow_discovery: true  // Permite descubrir peers
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`✅ Servidor HTTP en http://localhost:${PORT}`);
  console.log(`✅ Servidor PeerJS en ws://localhost:10001/myapp`);
});