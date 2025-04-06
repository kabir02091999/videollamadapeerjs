// Variables globales
let localStream;
let peer;
let currentCall;

// Configuración de PeerJS
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const peerConfig = {
  host: isProduction ? window.location.hostname : 'localhost',
  port: isProduction ? 443 : 9000,
  path: '/myapp',
  secure: isProduction,
  debug: 3
};

// 1. Función para terminar la llamada (que faltaba)
function endCall() {
  if (currentCall) {
    currentCall.close();
    document.getElementById('remote-video').srcObject = null;
    currentCall = null;
  }
  
  // Habilitar/deshabilitar botones
  document.getElementById('call-btn').disabled = false;
  document.getElementById('end-call-btn').disabled = true;
  document.getElementById('peer-id').disabled = false;
}

// 2. Función para configurar la llamada
function setupCall(call) {
  currentCall = call;

  // Deshabilitar controles durante la llamada
  document.getElementById('call-btn').disabled = true;
  document.getElementById('end-call-btn').disabled = false;
  document.getElementById('peer-id').disabled = true;

  call.on('stream', (remoteStream) => {
    document.getElementById('remote-video').srcObject = remoteStream;
  });

  call.on('close', endCall);
  call.on('error', endCall);
}

// 3. Función para iniciar una llamada
async function startCall() {
  const peerId = document.getElementById('peer-id').value.trim();
  if (!peerId) {
    alert('Por favor ingresa el ID del otro usuario');
    return;
  }

  try {
    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      document.getElementById('local-video').srcObject = localStream;
    }

    const call = peer.call(peerId, localStream);
    setupCall(call);
  } catch (err) {
    console.error('Error al iniciar llamada:', err);
    alert('Error al conectar: ' + err.message);
  }
}

// 4. Inicialización de la aplicación
async function init() {
  try {
    // Obtener acceso a cámara/micrófono
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById('local-video').srcObject = localStream;

    // Inicializar PeerJS
    peer = new Peer(peerConfig);

    peer.on('open', (id) => {
      console.log('ID de Peer asignado:', id);
      document.getElementById('my-id').textContent = id;
    });

    peer.on('error', (err) => {
      console.error('Error en PeerJS:', err);
      if (err.type === 'unavailable-id') {
        peer = new Peer(peerConfig); // Reintentar con nuevo ID
      }
    });

    // Manejar llamadas entrantes
    peer.on('call', (call) => {
      call.answer(localStream);
      setupCall(call);
    });

  } catch (err) {
    console.error('Error al inicializar:', err);
    alert('Error al acceder a los dispositivos: ' + err.message);
  }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Asignar event listeners a los botones
  document.getElementById('call-btn').addEventListener('click', startCall);
  document.getElementById('end-call-btn').addEventListener('click', endCall);
});