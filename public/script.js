// Variables globales
let localStream;
let peer;
let currentCall;

// Elementos del DOM
const callBtn = document.getElementById('call-btn');
const endCallBtn = document.getElementById('end-call-btn');
const peerIdInput = document.getElementById('peer-id');

// 1. Inicializar PeerJS y medios
async function init() {
  try {
    // Obtener stream de cámara/micrófono
    localStream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    });
    document.getElementById('local-video').srcObject = localStream;

    // Crear instancia Peer (sin ID fijo para mayor flexibilidad)
    peer = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/myapp'
    });

    // Eventos PeerJS
    peer.on('open', (id) => {
      document.getElementById('my-id').textContent = id;
      console.log('✅ Peer conectado con ID:', id);
    });

    peer.on('error', (err) => {
      console.error('❌ Error en Peer:', err);
      alert(`Error: ${err.type}`);
    });

    // Manejar llamadas entrantes
    peer.on('call', (call) => {
      call.answer(localStream);
      setupCall(call);
    });

  } catch (err) {
    console.error('Error al iniciar:', err);
    alert('No se pudo acceder a la cámara/micrófono');
  }
}

// 2. Configurar llamada (compartida para entrantes/salientes)
function setupCall(call) {
  currentCall = call;
  
  // Actualizar UI
  callBtn.disabled = true;
  endCallBtn.disabled = false;
  peerIdInput.disabled = true;

  // Manejar stream remoto
  call.on('stream', (remoteStream) => {
    document.getElementById('remote-video').srcObject = remoteStream;
  });

  // Cuando termina la llamada
  call.on('close', () => {
    endCall();
  });
}

// 3. Iniciar llamada
callBtn.addEventListener('click', async () => {
  const peerId = peerIdInput.value.trim();
  if (!peerId) return alert('Ingresa un ID válido');

  try {
    const call = peer.call(peerId, localStream);
    setupCall(call);
  } catch (err) {
    console.error('Error al llamar:', err);
    alert('No se pudo conectar');
  }
});

// 4. Terminar llamada
endCallBtn.addEventListener('click', endCall);

function endCall() {
  if (currentCall) {
    currentCall.close();
    document.getElementById('remote-video').srcObject = null;
    
    // Resetear UI
    callBtn.disabled = false;
    endCallBtn.disabled = true;
    peerIdInput.disabled = false;
    
    currentCall = null;
  }
}

// Iniciar la aplicación al cargar
window.addEventListener('DOMContentLoaded', init);gina
window.onload = init;