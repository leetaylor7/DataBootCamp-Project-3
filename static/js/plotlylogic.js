// =========================================================================================================================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This function is what makes the main chart
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// =========================================================================================================================
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

  // @TODO: Build the first Chart using the data 
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
     // checks to see if the comparison is for the same variable
     if (yearFilter[0] == baseFilter[0]) {
      var data = [trace1];
    }
    else {
       var data = [trace1, trace2];
    }

   var layout = {
     title: `${dataFilter} Breakdown By State`,
     xaxis: {
       tickmode: 'linear',
       type: 'category',
     },
    legend: {
      x: 0,
      y: 1,
    }
   };

   Plotly.newPlot("plotly", data, layout);


});
});
}

// =========================================================================================================================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// THIS Builds the Second Chart
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// =========================================================================================================================
function secondChart(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter) {

    var xData = [];
    var yData = [];
    var comp = [];
    var baseYData = [];
    var baseComp = [];
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
      comp
       .push(dataValues[j][compareFilter])
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
       baseComp
        .push(dataValues[j][compareFilter])
      }

      
  // makes the data comparison Chart
  var relativeChange = [];
  var compChange = [];
   for (var j = 0; j < dataKeys.length; j++) {
    relativeChange
     .push(((yData[j] / baseYData[j])-1))
    compChange
     .push(((comp[j] / baseComp[j]) - 1))
   }

   trace3 = {
     type: "bar",
     x: xData,
     y: relativeChange,
     name: `${dataFilter}`
    };

   trace4 = {
    type: "bar",
    x: xData,
    y: compChange,
    name: `${compareFilter}`
   }

   // =========================================================================================================================
   // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   // THIS Builds the Spread Chart! This is part of the second Chart Interface!!
   // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   // =========================================================================================================================
   if (dataFilter[0] == compareFilter[0]) {
     var data2 = [trace3];
   }
   else {
      var data2 = [trace3, trace4];
      
      // Makes the Spread Chart
      var spread = [];
      for (var j = 0; j < relativeChange.length; j++) {
        spread 
          .push((relativeChange[j] - compChange[j]))
        
      }

      trace5 = {
        type: "bar",
        x: xData,
        y: spread,
        name: "Relative Spread"
      }

      var layout3 = {
        title: `${dataFilter} - ${compareFilter} Spread by State`,
        xaxis: {
          tickmode: 'linear',
          type: 'category',
        },
        yaxis: {
          tickformat: ',.0%'
        }
      }
      var data3 = [trace5];

      Plotly.newPlot("plotlySpread", data3, layout3)
   }

  
  var layout2 = {
    title: `${dataFilter} and ${compareFilter} Change by State`,
    xaxis: {
      tickmode: 'linear',
      type: 'category',
    },
    yaxis: {
      tickformat: ',.0%'
    },
    legend: {
      x: 0,
      y: 1,
    }
  }

  Plotly.newPlot("plotlychange", data2, layout2);
});
});
}

// =========================================================================================================================
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// THIS MAKES THE PIE CHART
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// =========================================================================================================================
function thirdChart(yearFilter, dataFilter, baseFilter, regionFilter) {

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

 trace3 = {
   type: "pie",
   labels: xData,
   values: yData,
  };

var data2 = [trace3];

var layout2 = {
  title: `${dataFilter} as of ${yearFilter[0]} Pie Chart`,
}

Plotly.newPlot("plotlypie", data2, layout2);
});
});
}


// =========================================================================================================================
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// THIS Initializes the Dashboard
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// =========================================================================================================================
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
   var comSelector = d3.select('#selComp')
   const year = Object.entries(response[1997]);
     var key = Object.values(year[0])
     var dataNames = Object.keys(key[1])
       dataNames.forEach((DN) => {
         dataSelector
           .append("option")
           .text(DN)
           .property("value", DN)
          comSelector
          .append("option")
          .text(DN)
          .property("value", DN)
       });
  });
 // Builds the first chart
 buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
 secondChart(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
 thirdChart(yearFilter, dataFilter, baseFilter, regionFilter);
};


// =====================================================
// THIS IS WHERE THE FILTER VARIABLES LIVE!!!!!!
// =====================================================
 var yearFilter = [1997];
 var dataFilter = ["GDP (millions of dollars)"];
 var baseFilter = [1997];
 var regionFilter = ['/api/get_state'];
 var compareFilter = ["GDP (millions of dollars)"];
// =====================================================


 // Sets up a function to change the year filter for the chart
 function optionChanged(newYear) {
  yearFilter.push(newYear)
  var filterLength = yearFilter.length
  if (filterLength >= 2) {
    yearFilter.shift();
  }
   buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
   secondChart(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
   thirdChart(yearFilter, dataFilter, baseFilter, regionFilter);
 }

 // Sets up a function to change the data filter for the chart
 function dataChanged(newData) {
  dataFilter.push(newData)
  var filterLength = dataFilter.length
  if (filterLength >= 2) {
    dataFilter.shift();
  }
  buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
  secondChart(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
  thirdChart(yearFilter, dataFilter, baseFilter, regionFilter);
}

  // Sets up a function to change the base year for comparison 
  function baseChanged(newBase) {
    baseFilter.push(newBase)
    var filterLength = baseFilter.length
    if (filterLength >= 2) {
      baseFilter.shift();
    }
    buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
    secondChart(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);  
    thirdChart(yearFilter, dataFilter, baseFilter, regionFilter);
  }

   // Sets up a function to change the base year for comparison 
   function regionChanged(newRegion) {
    regionFilter.push(newRegion)
    var filterLength = regionFilter.length
    if (filterLength >= 2) {
      regionFilter.shift();
    }
    buildCharts(yearFilter, dataFilter, baseFilter, regionFilter);
    secondChart(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
    thirdChart(yearFilter, dataFilter, baseFilter, regionFilter);
   }

   function compChanged(newCompare) {
    compareFilter.push(newCompare)
    var filterLength = compareFilter.length
    if (filterLength >= 2) {
      compareFilter.shift();
    }
    secondChart(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
  }

init();