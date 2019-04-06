// function buildCharts(sample) {

  // // @TODO: Use `d3.json` to fetch the sample data for the plots
  //  var url = `/api/get`
  //  d3.json(url).then(function(response) {
  //    console.log(Object.entries(response))

//   // @TODO: Build a Bubble Chart using the sample data   
//   trace1 = {
//    type: "scatter",
//    x: response.otu_ids,
//    y: response.sample_values,
//    mode: "markers",
//    marker: {
//      size: response.sample_values,
//      color: response.otu_ids,
//    }
//  };

//    var data = [trace1];

//    var layout = {
//      title: "Bubble Chart"
//    };

//    Plotly.newPlot("plotly", data, layout);

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
// });
// }

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

     // console.log(response[selector])

   // Use the first sample from the list to build the initial plots
   const firstYear = selection[0];
    console.log(response[firstYear])
  //  buildCharts(firstYear);
  //  buildMetadata(firstSample);
});
}); 
}

// function optionChanged(newYear) {
//  // Fetch new data each time a new sample is selected
//  buildCharts(newYear);
//  buildMetadata(newYear);
// }

// // Initialize the dashboard
init();

// d3.json("/api/get").then((response) => {
//   var years = Object.keys(response)
//     years.forEach((year) =>
//       console.log(response[year])
// );