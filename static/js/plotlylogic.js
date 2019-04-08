
function buildCharts(yearFilter, dataFilter) {

    var xData = [];
    var yData = [];
//   // // @TODO: Use `d3.json` to fetch the sample data for the plots
   var url = `/api/get`
   d3.json(url).then(function(response) {
     var yearInfo = response[yearFilter]
     var dataKeys = Object.keys(yearInfo)
     var dataValues = Object.values(yearInfo)

     // loops over the selected year to populate the data
     for (var j = 0; j < dataKeys.length; j++) {
      yData
       .push(dataValues[j][dataFilter])
      xData
       .push(dataKeys[j])
     }

     console.log(yearFilter)
     console.log(dataFilter)

  // @TODO: Build a Bubble Chart using the sample data   
  trace1 = {
   type: "bar",
   x: xData,
   y: yData,
   mode: "markers",
 };

   var data = [trace1];

   var layout = {
     title: "Information Breakdown By State"
   };

   Plotly.newPlot("plotly", data, layout);

//   // @TODO: Build a Pie Chart
//   // HINT: You will need to use slice() to grab the top 10 sample_values,
//   // otu_ids, and labels (10 each).
//   trace2 = {
//     type: "pie",
//     labels: response.otu_ids.slice(0,10),
//     values: response.sample_values.slice(0,10),
//     text: response.otu_labels.slice(0,10)    
//   };

//   var data2 = [trace2];

//   var layout2 ={
//     title: "Pie Chart"
//   }

//   Plotly.newPlot("pie", data2, layout2)
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selYear");
 
  // Use the list of sample names to populate the select options
  d3.json("/api/get").then((response) => {
    var selection = Object.keys(response)
       selection.forEach((Y) => {
         selector
           .append("option")
           .text(Y)
           .property("value", Y)
   });

   // populates the list for the different data
   var dataSelector = d3.select('#selData')
   const year = Object.entries(response[1997]);
     var key = Object.values(year[0])
     var dataNames = Object.keys(key[1])
       dataNames.forEach((DN) => {
         dataSelector
           .append("option")
           .text(DN)
           .property("value", DN)
       });
 }); 

 // Builds the first chart
 buildCharts(yearFilter, dataFilter);
}

 var yearFilter = [1997];
 var dataFilter = ["GDP (millions of dollars)"];

 // Sets up a function to change the year filter for the chart
 function optionChanged(newYear) {
  yearFilter.push(newYear)
  var filterLength = yearFilter.length
  if (filterLength >= 2) {
    yearFilter.shift();
  }
  else {
  }
   buildCharts(yearFilter, dataFilter);
 }

 // Sets up a function to change the data filter for the chart
 function dataChanged(newData) {
  dataFilter.push(newData)
  var filterLength = dataFilter.length
  if (filterLength >= 2) {
    dataFilter.shift();
  }
  else {
  }
  buildCharts(yearFilter, dataFilter);
 }


init();
