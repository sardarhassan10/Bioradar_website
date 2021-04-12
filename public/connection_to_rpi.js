var database = firebase.database();
var ref = database.ref('Connection_Data');
var ip = '';
var port = '';
var address;
var connected = false;
var socket; 
var received_message = '';

//add refernce to database
ref.on ('value', getData,err);


// function to get data
function getData(data){
	//console.log('Hello');
	var Data = data.val();
	var keys = Object.keys(Data);
	console.log(keys); //get keys
    ip = Data[keys[0]];
    console.log(ip);
    port = Data[keys[1]];
    console.log(port);
    address = "ws://" + ip.toString() + ":" + port.toString();
    console.log(address);
    start_connection();
}


// function to display erro
function err(error){
	console.log('Error!');
	console.log(error);
}



function start_connection (){
    // Create WebSocket connection.
    socket = new WebSocket(address); //'ws://192.168.100.103:40000'
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
        received_message = '';
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);  
        received_message = event.data;  
    });

}

// Send a msg to the websocket
const connect = () => {
    if (connected === false){
        alert('No connection. Please make sure RPI is connected and then refresh this page.');
    } else {
        if (received_message === 'Processing'){
            alert('Already started');
        } else {
            socket.send('Start');
            console.log('sent');
        }
    }
}