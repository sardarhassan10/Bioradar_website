//import library to convert array to csv
import XlsExport from "./xlsexport/xls-export.js"; 

//set functions to global
window.getUser = getUser;
window.getFilter = getFilter;
window.searchButtonFunction = searchButtonFunction;
window.downloadButtonFunction = downloadButtonFunction;

// Get a reference to the database service
var database = firebase.database();
// get name of all users 
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
  //add refernce to user
ref.on ('value', getData,err);


var selected_user; //selected user
var selected_filter; //selected filter
var setData; //all data from database  
var userData = []; //all data of user
var filteredData = []; //all of the filtered data 

// function to get Text format of date 
function getDateText(msnumber)
{
    var d = new Date(parseInt(msnumber)); 
    return d.toDateString();
}

// function to get Text format of time 
function getTimeText(msnumber){
    var d = new Date(parseInt(msnumber)); 
    return d.toTimeString();
}

//function to create table header
function printTableHeader(){
    var table = document.getElementById("vitalTable");
    var header = table.createTHead();
    var row = header.insertRow(0);

    var cell = row.insertCell(0);
    cell.innerHTML = "<b>Date</b>";

    var cell1 = row.insertCell(1);
    cell1.innerHTML = "<b>Time</b>";

    var cell2 = row.insertCell(2);
    cell2.innerHTML = "<b>HR</b>";

    var cell3 = row.insertCell(3);
    cell3.innerHTML = "<b>BR</b>";

    var cell4 = row.insertCell(4);
    cell4.innerHTML = "<b>HRV</b>";
}



//function to print vital signs
function printVitalSign(readings){

    //what to say when data is available and when it is not available 
    if(filteredData.length == 0)
    document.getElementById("dataAvailability").innerHTML = 'No Data Available.';
    else 
    document.getElementById("dataAvailability").innerHTML = 'Data Available:';
    
    //remove previous values 
    $("#vitalTable tr").remove(); 
    // print table header
    printTableHeader();

    // for number of data instances 
    for (var i = 0;i<readings.length;i++)
    {
        //select table and row where data is to be entered 
        var table = document.getElementById("vitalTable");
        var row = table.insertRow(i+1);

        //select cell of row to enter data into
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        //enter data 
        cell1.innerHTML = readings[i].Date;
        cell2.innerHTML = readings[i].Time;
        cell3.innerHTML = readings[i].HR;
        cell4.innerHTML = readings[i].BR;
        cell5.innerHTML = readings[i].HRV;
    }


}


//function when All filter is selected
function allFilter()
{
   
    for (var i =0;i<userData.length;i++)
            {   
                filteredData.push({
                    "Date": getDateText(userData[i].Timekey),
                    "Time": getTimeText(userData[i].Timekey),
                    "HR":userData[i].HR,
                    "BR":userData[i].BR,
                    "HRV":userData[i].HRV
                });
            }
}

//function when today filter is selected
function todayFilter(){
    //find ms from epoch for today 
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    var todaystart = d.getTime();
    console.log(d.toString());

    for (var i =0;i<userData.length;i++)
    {   var dataDateTime = parseInt(userData[i].Timekey);
        //check if HR selected
        if (dataDateTime>=todaystart){
            filteredData.push({
                "Date": getDateText(userData[i].Timekey),
                "Time": getTimeText(userData[i].Timekey),
                "HR":userData[i].HR,
                "BR":userData[i].BR,
                "HRV":userData[i].HRV
            });
        }
    }

}


//function when yesterday filter is selected 
function yesterdayFilter(){
    //find ms from epoch for today 
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    var todaystart = d.getTime();
    console.log(d.toString());
    d.setDate(d.getDate()-1);
    var yesterdaystart = d.getTime();
    console.log(d.toString());

    for (var i =0;i<userData.length;i++)
    {   var dataDateTime= parseInt(userData[i].Timekey);
        //check if HR selected
        if (dataDateTime<todaystart && dataDateTime>=yesterdaystart){
            filteredData.push({
                "Date": getDateText(userData[i].Timekey),
                "Time": getTimeText(userData[i].Timekey),
                "HR":userData[i].HR,
                "BR":userData[i].BR,
                "HRV":userData[i].HRV
            });
        }
    } 
}

//function when past 6 hour filter selected 
function previousSixHoursFilter(){
    //find ms from epoch for six hours from right now 
    var d = new Date();
    d.setHours(d.getHours()-6);
    var sixHoursBefore = d.getTime();
    console.log(d.getTime());

    for (var i =0;i<userData.length;i++)
    {   var dataDateTime= parseInt(userData[i].Timekey);
        //check if HR selected
        if (dataDateTime>=sixHoursBefore){
            filteredData.push({
                "Date": getDateText(userData[i].Timekey),
                "Time": getTimeText(userData[i].Timekey),
                "HR":userData[i].HR,
                "BR":userData[i].BR,
                "HRV":userData[i].HRV
            });
        }
    } 
}


//function when past hour is selected 
function pastHourFilter(){
    //find ms from epoch for six hours from right now 
    var d = new Date();
    d.setHours(d.getHours()-1);
    var pastHour = d.getTime();
    //console.log(d.getTime());
    
    for (var i =0;i<userData.length;i++)
    {   var dataDateTime= parseInt(userData[i].Timekey);
        //check if HR selected
        if (dataDateTime>=pastHour){
            filteredData.push({
                "Date": getDateText(userData[i].Timekey),
                "Time": getTimeText(userData[i].Timekey),
                "HR":userData[i].HR,
                "BR":userData[i].BR,
                "HRV":userData[i].HRV
            });
        }
    } 
}

// function to display error
function err(error){
	console.log('Error!');
	console.log(error);
}

// function there is a data update
function getData(data)
{   //get keys
    setData = data.val();

    //if data updates 
    if (selected_filter != null && selected_user != null && selected_vital_sign != null){
        console.log('entered');
        buttonFunction();
    }
}

//function to fill data arrray
function fillData(){
    var y = setData[selected_user]; 
    //print instances of time data 
    var timekeys = Object.keys(y);

    var x;
    userData= [];
    for (var i = 0; i < timekeys.length; i++) { 
        x = y[timekeys[i]];
        //console.log(x);
        userData.push({
            "Timekey":timekeys[i],
            "HR":x.HR,
            "BR":x.BR,
            "HRV":x.HRV
        });
    }
}

// function to get user name 
function getUser(){
    selected_user = document.getElementById("userlist").value;
    console.log(selected_user);
    // get data of selected user 
}

//function to get selected filter
function getFilter(){
    selected_filter = document.getElementById("filterlist").value;
    console.log(selected_filter);
}

//function called when search is clicked 
function searchButtonFunction(){

    //console.log(timekeys);
    filteredData = [];
    fillData();
    //if data not available
    if (userData == null){ 
        console.log("No data");
        document.getElementById("dataAvailability").innerHTML = 'No Data Available:';
    }
    //if data available
    else {
        if (selected_filter=='All')
        {
            //console.log('All selected');
            allFilter(); //call function to display all data
            printVitalSign(filteredData);
        }
        else if (selected_filter=='Yesterday'){
            yesterdayFilter();
            printVitalSign(filteredData);
        }
        else if (selected_filter=='Today'){
            todayFilter();
            printVitalSign(filteredData);
        }
        else if (selected_filter=='PreviousSixHours'){
            previousSixHoursFilter();
            printVitalSign(filteredData);
        }
        else if (selected_filter=='LastHour'){
            pastHourFilter();
            printVitalSign(filteredData);
        }
    }
}

//function to initiate csv file download
function download()
{
    //export to CSV
    console.log(filteredData);
    var xls = new XlsExport(filteredData, selected_user);
    xls.exportToCSV(selected_user + '.csv');
}

//function called when download button is clicked 
function downloadButtonFunction()
{
    if (selected_user != 'Select' && selected_user != null){
            if (selected_filter != 'Select' && selected_filter != null){
                filteredData = [];
                if (selected_filter == 'All'){
                    fillData();
                    allFilter(); //call function to display all data
                    if (filteredData.length != 0)
                        download();
                    else 
                        alert('No Data');
                }
                else if (selected_filter=='Yesterday'){
                    fillData();
                    yesterdayFilter();
                    if (filteredData.length != 0)
                        download();
                    else 
                        alert('No Data');
                }
                else if (selected_filter=='Today'){
                    fillData();
                    todayFilter();
                    if (filteredData.length != 0)
                        download();
                    else 
                        alert('No Data');
                }
                else if (selected_filter=='PreviousSixHours'){
                    fillData();
                    previousSixHoursFilter();
                    if (filteredData.length != 0)
                        download();
                    else
                        alert('No data!');
                }
                else if (selected_filter=='LastHour'){
                    fillData();
                    pastHourFilter();
                    if (filteredData.length != 0)
                        download();
                     else 
                        alert('No data!');}
                
            }
        }
    else {
        alert('Please Select Correct Filters!')
    }
}




