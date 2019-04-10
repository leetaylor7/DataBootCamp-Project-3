// This function is what makes the chart
function buildCharts(yearFilter, dataFilter, baseFilter, regionFilter) {

    var xData = [];
    var yData = [];
    var baseYData = [];
//   // // @TODO: Use `d3.json` to fetch the sample data for the plots
   var url = regionFilter[0]
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

     d3.json(url).then(function(response) {
      var yearInfo = response[baseFilter]
      var dataKeys = Object.keys(yearInfo)
      var dataValues = Object.values(yearInfo)
 
      // loops over the selected year to populate the data
      for (var j = 0; j < dataKeys.length; j++) {
       baseYData
        .push(dataValues[j][dataFilter])
      }

  // @TODO: Build a Bubble Chart using the sample data 
  trace1 = {
   type: "bar",
   x: xData,
   y: yData,
   name: `${yearFilter}`,
 };

  trace2 = {
    type: "bar",
    x: xData,
    y: baseYData,
    name: `${baseFilter}`,
  };

   var data = [trace1, trace2];

   var layout = {
     title: `${dataFilter} Breakdown By State`,
   };

   Plotly.newPlot("plotly", data, layout);

});
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selYear");
  var baseSelector = d3.select("#selBase")
  console.log(regionFilter)
  // Use the list of sample names to populate the select options
  d3.json(regionFilter).then((response) => {
    var selection = Object.keys(response)
       selection.forEach((Y) => {
         selector
           .append("option")
           .text(Y)
           .property("value", Y)
         baseSelector
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
 buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
}


// =====================================================
// THIS IS WHERE THE FILTER VARIABLES LIVE!!!!!!
// =====================================================
 var yearFilter = [1997];
 var dataFilter = ["GDP (millions of dollars)"];
 var baseFilter = [1997];
 var regionFilter = ['/api/get_state'];
// =====================================================


 // Sets up a function to change the year filter for the chart
 function optionChanged(newYear) {
  yearFilter.push(newYear)
  var filterLength = yearFilter.length
  if (filterLength >= 2) {
    yearFilter.shift();
  }
  else {
  }
   buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
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
  buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
}

  // Sets up a function to change the base year for comparison 
  function baseChanged(newBase) {
    baseFilter.push(newBase)
    var filterLength = baseFilter.length
    if (filterLength >= 2) {
      baseFilter.shift();
    }
    else {
    }
    buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
 }

   // Sets up a function to change the base year for comparison 
   function regionChanged(newRegion) {
    regionFilter.push(newRegion)
    var filterLength = regionFilter.length
    if (filterLength >= 2) {
      regionFilter.shift();
    }
    else {
    }
    buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
   }

init();
