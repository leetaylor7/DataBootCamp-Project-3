// Creating map object
// center on US
let map = L.map("chart", {
    center: [39.8283, -98.5795],
    zoom: 4
});

// adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={key}", {
    id: "mapbox.streets",
    key: API_KEY
}).addTo(map);

// placeholder for coloring function
//function chooseColor(state) {
//  CODE
//}

// create popup function
let getPopup = function(feature, layer) {
    let content = `<h1>${feature.properties.NAME}</h1>`;
    layer.bindPopup(content);
}


// holds geoJSON layer
let geoLay;
// function to 
// get geoJSON file (stateboarder.json = stateBorders) and lay out Leaflet map
function setMap(yearFilter, dataFilter, baseFilter, regionFilter) {
    updateColor();
    if (geoLay) {
        map.removeLayer(geoLay);
    }
    geoLay = L.geoJSON(stateBorders, {
        style: function(feature) {
            return {
                color: "#000000",
                fillColor: getColor(feature),
                fillOpacity: 0.4,
                weight: 2.5
            };
        },
        onEachFeature: function(feature, layer) {
            getPopup(feature, layer);
        }
    });
    geoLay.addTo(map);
}

function secondChart(yearFilter, dataFilter, baseFilter, regionFilter) {

  xData = [];
  var yData = [];
  comp = [];
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
// ============================================================
// HERE IS THE CALCULATION AND MAPPING YOU ARE LOOKING FOR!!!!!    
// makes the data comparison Chart
// ============================================================
var relativeChange = [];
var compChange = [];
for (var j = 0; j < dataKeys.length; j++) {
  relativeChange.push(((yData[j] / baseYData[j])-1));
  compChange.push(((comp[j] / baseComp[j]) - 1));
 }
 console.log(comp)
 console.log(xData)
 console.log([comp, xData])
 //=============================================================
 //=============================================================
 //=============================================================
});
});
}
// initialization function
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
    secondChart(yearFilter, dataFilter, baseFilter, regionFilter);
    setMap(yearFilter, dataFilter, baseFilter, regionFilter);
}

// ############################################
// #####   FILTER VARIABLES DECLARATION   #####
// ############################################
let yearFilter = [1997];
let dataFilter = ["GDP (millions of dollars)"];
let baseFilter = [1997];
let regionFilter = ['/api/get_state'];
let compareFilter = ["GDP (millions of dollars)"];
let comp;
let xData;
let colorsObj = {};

//  onChange functions
function optionChanged(newYear) {
    yearFilter.push(newYear)
    var filterLength = yearFilter.length
    if (filterLength >= 2) {
      yearFilter.shift();
    }
    secondChart(yearFilter, dataFilter, baseFilter, regionFilter);
    setMap(yearFilter, dataFilter, baseFilter, regionFilter);
}
function dataChanged(newData) {
    dataFilter.push(newData)
    var filterLength = dataFilter.length
    if (filterLength >= 2) {
      dataFilter.shift();
    }
    secondChart(yearFilter, dataFilter, baseFilter, regionFilter);
    setMap(yearFilter, dataFilter, baseFilter, regionFilter);
}
function baseChanged(newBase) {
    baseFilter.push(newBase)
    var filterLength = baseFilter.length
    if (filterLength >= 2) {
      baseFilter.shift();
    }
    secondChart(yearFilter, dataFilter, baseFilter, regionFilter);
    setMap(yearFilter, dataFilter, baseFilter, regionFilter);
}
function regionChanged(newRegion) {
    regionFilter.push(newRegion)
    var filterLength = regionFilter.length
    if (filterLength >= 2) {
      regionFilter.shift();
    }
    secondChart(yearFilter, dataFilter, baseFilter, regionFilter);
    setMap(yearFilter, dataFilter, baseFilter, regionFilter);
}

// make the getColor function
// basically this relies on running secondChart first
// since I believe? that it updates the values we care about
// I made comp and xData global variables (array type) which should be updated inside secondChart

// basically this will take the feature and check by state name which color it should have
// there will be a supplemental function below
function getColor(feature) {
  console.log(colorsObj);
  return colorsObj[feature.properties.NAME];
}

/* #############################################
################################################
#####  MAKE SURE TO RUN updateColor()  BEFORE ##
################################################
############################################# */

// supplemental function to update the colorsObj
// stores state names as keys, colors as values
// relies on recently running secondChart to have up-to-date [comp, xData]   (#, name)
function updateColor() {
//  console.log('running updateC');
  for (let i = 0; i < comp.length; i++) {
    let colorI;
    if (comp[i] < -50000) {
      colorI = '#400000';
    }else if (comp[i] < 0) {
      colorI = '#ff0000';
    }else if (comp[i] < 50000) {
      colorI = '#00ff00';
    }else{
      colorI = '#006400';
    }
    colorsObj[xData[i]] = colorI;
  }
}

init();