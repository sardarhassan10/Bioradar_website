// Create WebSocket connection.
const socket = new WebSocket('ws://192.168.100.103:40000');
var connected = false;
// Connection opened
socket.addEventListener('open', function (event) {
    console.log('Connected to the WS Server!');
    document.getElementById("Status").innerHTML = "Status: Connected";
    document.getElementById("Status").style.color = "#53a351";
    connected = true;
});

// Connection closed
socket.addEventListener('close', function (event) {
    console.log('Disconnected from the WS Server!');
    document.getElementById("Status").innerHTML = "Status: Disconnected. Please make sure RPI is on and refresh this page.";
    document.getElementById("Status").style.color = "red";
    connected = false;
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});
// Send a msg to the websocket
const connect = () => {
    if (connected === false){
        alert('No connection. Please make sure RPI is connected and then refresh this page.');
    } else {
        socket.send('Start');
        console.log('sent');
    }
}