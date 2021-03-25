//import library to convert array to csv
import XlsExport from "./xlsexport/xls-export.js"; 

//set functions to global
window.getUser = getUser;
window.getVitalSign = getVitalSign;
window.getFilter = getFilter;
window.searchButtonFunction = searchButtonFunction;
window.downloadButtonFunction = downloadButtonFunction;
window.getVitalSign = getVitalSign;
window.getFilter = getFilter;

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
var selected_vital_sign; //selected vital sign
var selected_filter; //selected filter
var setData; //all data from database  
var userData = []; //all data of user
var filteredData = []; //all of the filtered data 

// function to get user name 
function getUser(){
    selected_user = document.getElementById("userlist").value;
    console.log(selected_user);
    // get data of selected user 
}

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

//function to print vital signs
function printVitalSign(readings){
    for (var i = 0;i<readings.length;i++)
    {
        if (selected_vital_sign == 'HR'){
            var node = document.createElement("li"); 
            var textnode = document.createTextNode(selected_vital_sign + " is " + readings[i].HR + " at " + readings[i].Date + " " + readings[i].Time); 
            node.appendChild(textnode);
            document.getElementById("Datalist").appendChild(node);
        }

        else if (selected_vital_sign == 'HRV'){
            var node = document.createElement("li"); 
            var textnode = document.createTextNode(selected_vital_sign + " is " + readings[i].HRV + " at " + readings[i].Date + " " + readings[i].Time); 
            node.appendChild(textnode);
            document.getElementById("Datalist").appendChild(node);
        }

        else if (selected_vital_sign == 'BR'){
            var node = document.createElement("li"); 
            var textnode = document.createTextNode(selected_vital_sign + " is " + readings[i].BR + " at " + readings[i].Date + " " + readings[i].Time); 
            node.appendChild(textnode);
            document.getElementById("Datalist").appendChild(node);
        }
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
    if (userData != null)
        document.getElementById("dataAvailability").innerHTML = 'Data Available:';
    else 
        document.getElementById("dataAvailability").innerHTML = 'No Data Available.';
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

    if(filteredData.length == 0)
        document.getElementById("dataAvailability").innerHTML = 'No Data Available.';
    else 
        document.getElementById("dataAvailability").innerHTML = 'Data Available:';
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
    
    if(filteredData.length == 0)
        document.getElementById("dataAvailability").innerHTML = 'No Data Available.';
    else 
        document.getElementById("dataAvailability").innerHTML = 'Data Available:';
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


    if(filteredData.length == 0)
        document.getElementById("dataAvailability").innerHTML = 'No Data Available.';
    else 
        document.getElementById("dataAvailability").innerHTML = 'Data Available:';  
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
    if(filteredData.length == 0)
        document.getElementById("dataAvailability").innerHTML = 'No Data Available.';
    else 
        document.getElementById("dataAvailability").innerHTML = 'Data Available:';  
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

//function to get selected vital sign
function getVitalSign(){
    selected_vital_sign = document.getElementById("vitallist").value;
    console.log(selected_vital_sign);
}

//function to get selected filter
function getFilter(){
    selected_filter = document.getElementById("filterlist").value;
    console.log(selected_filter);
}

//function called when search is clicked 
function searchButtonFunction(){
    //clear list 
    var toClear = document.getElementById("Datalist");
    while( toClear.firstChild ){
        toClear.removeChild( toClear.firstChild );
      }

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
                    updateData();
                    yesterdayFilter();
                    if (filteredData.length != 0)
                        download();
                    else 
                        alert('No Data');
                }
                else if (selected_filter=='Today'){
                    updateData();
                    todayFilter();
                    if (filteredData.length != 0)
                        download();
                    else 
                        alert('No Data');
                }
                else if (selected_filter=='PreviousSixHours'){
                    updateData();
                    previousSixHoursFilter();
                    if (filteredData.length != 0)
                        download();
                    else
                        alert('No data!');
                }
                else if (selected_filter=='LastHour'){
                    updateData();
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




