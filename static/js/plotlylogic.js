
function buildCharts(Y) {

    var xData = [];
    var yData = [];
//   // // @TODO: Use `d3.json` to fetch the sample data for the plots
   var url = `/api/get`
   d3.json(url).then(function(response) {
     console.log(Y)
     var yearInfo = response[1997]
     var dataKeys = Object.keys(yearInfo)
     var dataValues = Object.values(yearInfo)
    //  console.log(dataNames)
     for (var j = 0; j < dataKeys.length; j++) {
      //  console.log(dataKeys[j])
      yData
       .push(dataValues[j][Y])
      xData
       .push(dataKeys[j])
     }

     console.log(xData)
     console.log(yData)

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

 // Fetch new data each time a new item is selected


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
   //  buildCharts(response);
   //  buildMetadata(firstSample);
   });
   // Use the first sample from the list to build the inSitial plots
 
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
 
 
     // console.log(firstYear[0][1])
     // firstYear.forEach((State) => {
       // console.log(State)
     // });
 }); 
 }
 
 function optionChanged(newData) {
  var changedData = newData
  //  console.log(changedData)
   buildCharts(changedData);
 }

init();

// d3.json("/api/get").then((response) => {
//   var years = Object.keys(response)
//     years.forEach((year) =>
//       console.log(response[year])
// );