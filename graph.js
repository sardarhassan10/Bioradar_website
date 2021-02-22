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
var ref = database.ref('sardar');
ref.on ('value', getData,err);
var  today = new Date(); //new date object
var hr = 0;
var br = 0;
var hrv = 0;
//var br_graph_data= [12,10,11,13];
var br_graph_data = []; //= [["16:10:10",12],["16:10:12",13],["16:10:14",15]];
var hr_graph_data = [];
var hrv_graph_data = [];
var graph_counter = 0;
const graph_limit = 5;

// function to get date
function getDate (){
	//var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	//var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var mm = months[today.getMonth()];
	var yyyy = today.getFullYear();
	yyyy= yyyy%2000;
	today = dd + mm + yyyy;
	console.log(today);
}
window.onload = getDate(); //Always check for date at loading of webpage
console.log(today); //display date


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
 /*
function resize() {
var chart = new google.visualization.LineChart(document.getElementById(id));
chart.draw(data, options1);
}
window.onload = resize();
window.onresize = resize;
	}
*/
}}

$(window).resize(function(){
	drawGraph(br_graph_data,'BRGraph');
	drawGraph(hr_graph_data,'HRGraph');
	drawGraph(hrv_graph_data,'HRVGraph');
});


// function to get data
function getData(data){
	//console.log('Hello');
	var setData = data.val();
	var keys = Object.keys(setData);
	console.log(keys); //get keys
	todaysData = setData[today];
	if (todaysData != undefined) // if data exists
	{
		console.log(todaysData); // get todays data
		todaysDataKeys = Object.keys(todaysData);
		console.log(todaysDataKeys);
		var k = todaysDataKeys[todaysDataKeys.length-1]; // get last key
		todaysDataLast = todaysData[k]; // get last data
		hr = todaysDataLast.HR;
		br = todaysDataLast.BR;
		hrv = todaysDataLast.HRV;
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

	} else {
		document.getElementById("HRVData").innerHTML = 'No Data For Today';
		document.getElementById("HRData").innerHTML = 'No Data For Today';
		document.getElementById("BRData").innerHTML = 'No Data For Today';
		//br_graph_data.push([k,br]);
		drawGraph(br_graph_data,'BRGraph');
		drawGraph(hr_graph_data,'HRGraph');
		drawGraph(hrv_graph_data,'HRVGraph');
	}


}


// function to display erro
function err(error){
	console.log('Error!');
	console.log(error);
}
/*
function sendData() {
	firebase.database().ref('sardar/' + 'doc1').set({
	HR: 15,
	BR: 77.9,
	HRV: 28.3
	});
}
document.getElementById('sending').addEventListener('click', sendData,false);
*/
