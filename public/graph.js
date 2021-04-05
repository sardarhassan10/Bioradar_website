// @ts-nocheck

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//const firebaseConfig = {
//	apiKey: "AIzaSyATjdo9-LnDVRgxfeuQaOopO4EIFmTXEik",
//	authDomain: "bioradar.firebaseapp.com",
//	databaseURL: "https://bioradar-default-rtdb.europe-west1.firebasedatabase.app",
//	projectId: "bioradar",
//	storageBucket: "bioradar.appspot.com",
//	messagingSenderId: "857754767607",
//	appId: "1:857754767607:web:78f269b3f4da42c60343f2",
//	measurementId: "G-0SC2CY2RDM"
//};

//firebase.initializeApp(firebaseConfig);


// Get a reference to the database service
var database = firebase.database();
var ref = database.ref('Users');
ref.once('value',  function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      	var childKey = childSnapshot.key;
		//console.log(childKey);
		var x = document.getElementById("userlist");
		var option = document.createElement("option");
		option.text = childKey;
		x.add(option);
      // ...
    });
  });


//ref.on ('value', getData,err);
var hr = 0;
var br = 0;
var hrv = 0;
var selected_user; //selected user
var once = false;
var setData;
var firstrun = true;
var lastPointTime;
var temp;
//var br_graph_data= [12,10,11,13];
var br_graph_data = []; //= [["16:10:10",12],["16:10:12",13],["16:10:14",15]];
var hr_graph_data = [];
var hrv_graph_data = [];
var graph_counter = 0;
const graph_limit = 5;

//function to get time 
function getTime(msValue){
	var d = new Date(parseInt(msValue)); 
	console.log(d.toLocaleTimeString());
	return d.toLocaleTimeString();
}

function drawGraph(data_set, id){

	google.charts.load('current', {packages: ['corechart', 'line']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart(){

		var title_yaxis;
		var window_width = $(document).width();
		var graph_width;
		console.log(window_width);

		if(window_width <650)
		{
			graph_width= 300;
		}
		else if (window_width<1000 && window_width>650){
			graph_width= 650;
		}
		else {
			graph_width= 900;
		}

		var variable;
		if (id == 'BRGraph')
		{ title_yaxis = 'BR/BPM';
			variable = 'BR';
		} else if ( id == 'HRGraph'){
		title_yaxis = 'HR/BPM';
		variable = 'HR';
		} else {
		title_yaxis = 'HRV';
		variable = 'HRV';
		}

		var data = new google.visualization.DataTable();
		data.addColumn('string', 'x');
		data.addColumn('number', variable);

		data.addRows(data_set);

		var options1 = {
	 		hAxis: {
			textStyle:{color: '#53a351'},
		 	title: 'Time',
			titleTextStyle: {color: '#53a351'},
			gridlines: {color: '#1E4D6B'}
	 	},
	 		vAxis: {
			//textStyle:{color: '#53a351'},
			title: title_yaxis,
			gridlines: {color: '#1E4D6B'},
			textStyle: {
				color: '#53a351',
				fontSize: 16,
				bold: true
			},
			titleTextStyle: {color: '#53a351'}
	 	},
		backgroundColor: {'fill': '#22252c',
			'stroke': 'green',
			'strokeWidth':0},
		//backgroundColor.stroke : '#53a351',
		color: '#53a351',
		legendTextStyle: { color: '#53a351' },
		//titleTextStyle: { color: '#53a351' },
		width: graph_width,
		height: 300,
 };

 var chart = new google.visualization.LineChart(document.getElementById(id));
 chart.draw(data, options1);

}}

$(window).resize(function(){
	drawGraph(br_graph_data,'BRGraph');
	drawGraph(hr_graph_data,'HRGraph');
	drawGraph(hrv_graph_data,'HRVGraph');
});


// function to get data
function getData(data){
	//console.log('Hello');
	setData = data.val();
	var keys = Object.keys(setData);
	console.log(keys); //get keys
	if (selected_user!= null && selected_user != 'Select' )
		drawing();

}


// function to display erro
function err(error){
	console.log('Error!');
	console.log(error);
}


function getUser(){
	selected_user = '';
	selected_user = document.getElementById("userlist").value;
	console.log(selected_user);
	br_graph_data = [];
	hr_graph_data = [];
	hrv_graph_data = [];
	graph_counter = 0;
	firstrun = true;
	
	var str='';
	str= 'Users/'+selected_user;
	ref.off();
	ref = database.ref(str);
	ref.on ('value', getData,err);

}


function drawing(){
	console.log('entered drawing');
	if (firstrun != true) // if data exists
	{

		//var y = setData[selected_user];
		var timekeys = Object.keys(setData);
		var latestData = setData[timekeys[timekeys.length - 1]];
		lastPointTime = timekeys[timekeys.length - 1];
		//if (lastPointTime!=temp){

			temp = lastPointTime;
			hr = latestData.HR;
			br = latestData.BR;
			hrv = latestData.HRV;
			k = getTime(lastPointTime);
			console.log('HR is', hr, 'BR is ', br, 'HRV is ' , hrv);
			//print values in HTML
			document.getElementById("HRVData").innerHTML = 'HRV recorded at '+ k +' is: ' + hrv;
			document.getElementById("HRData").innerHTML = 'HR recorded at ' + k + ' is: ' + hr + ' BPM';
			document.getElementById("BRData").innerHTML = 'BR recorded at ' + k + ' is: ' + br + ' BPM';
			br_graph_data.push([k,br]);
			hr_graph_data.push([k,hr]);
			hrv_graph_data.push([k,hrv]);
			graph_counter +=1;
			if (graph_counter>=graph_limit+1) //make sure not more than 5 data points are shown in graph
			{
				br_graph_data.shift();
				hr_graph_data.shift();
				hrv_graph_data.shift();
			}
			drawGraph(br_graph_data,'BRGraph');
			drawGraph(hr_graph_data,'HRGraph');
			drawGraph(hrv_graph_data,'HRVGraph');
		//}

	} else {
		firstrun =false;
		document.getElementById("HRVData").innerHTML = 'No Data';
		document.getElementById("HRData").innerHTML = 'No Data';
		document.getElementById("BRData").innerHTML = 'No Data';
		//br_graph_data.push([k,br]);
		drawGraph(br_graph_data,'BRGraph');
		drawGraph(hr_graph_data,'HRGraph');
		drawGraph(hrv_graph_data,'HRVGraph');
	}
}

/*
function buttonFunction(){
	console.log('pressed');
}

function sendData() {
	firebase.database().ref('sardar/' + 'doc1').set({
	HR: 15,
	BR: 77.9,
	HRV: 28.3
	});
}
document.getElementById('sending').addEventListener('click', sendData,false);
*/
