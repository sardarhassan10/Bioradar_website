// Create WebSocket connection.
const socket = new WebSocket('ws://192.168.100.103:40000');
  
// Connection opened
socket.addEventListener('open', function (event) {
    console.log('Connected to the WS Server!');
    document.getElementById("Status").innerHTML = "Status: Connected";
});

// Connection closed
socket.addEventListener('close', function (event) {
    console.log('Disconnected from the WS Server!');
    document.getElementById("Status").innerHTML = "Status: Disconnected. Please make sure RPI is on and refresh this page.";
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});
// Send a msg to the websocket
const connect = () => {
    socket.send('Start');
    console.log('sent');
}