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
function setMap(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter) {
    if (geoLay) {
        map.removeLayer(geoLay);
    }
    geoLay = L.geoJSON(stateBorders, {
        style: function(feature) {
            return {
                color: "#000000",
                fillColor: getColor(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter),
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
    setMap(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
}

// ############################################
// #####   FILTER VARIABLES DECLARATION   #####
// ############################################
let yearFilter = [1997];
let dataFilter = ["GDP (millions of dollars)"];
let baseFilter = [1997];
let regionFilter = ['/api/get_state'];
let compareFilter = ["GDP (millions of dollars)"];

//  onChange functions
function optionChanged(newYear) {
    yearFilter.push(newYear)
    var filterLength = yearFilter.length
    if (filterLength >= 2) {
      yearFilter.shift();
    }
    setMap(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
}
function dataChanged(newData) {
    dataFilter.push(newData)
    var filterLength = dataFilter.length
    if (filterLength >= 2) {
      dataFilter.shift();
    }
    setMap(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
}
function baseChanged(newBase) {
    baseFilter.push(newBase)
    var filterLength = baseFilter.length
    if (filterLength >= 2) {
      baseFilter.shift();
    }
    setMap(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
}
function regionChanged(newRegion) {
    regionFilter.push(newRegion)
    var filterLength = regionFilter.length
    if (filterLength >= 2) {
      regionFilter.shift();
    }
    setMap(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
}
function compChanged(newCompare) {
    compareFilter.push(newCompare)
    var filterLength = compareFilter.length
    if (filterLength >= 2) {
      compareFilter.shift();
    }
    secondChart(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter);
}

// make the getColor function
// taken from plotlylogic for comparison chart
function getColor(yearFilter, dataFilter, baseFilter, regionFilter, compareFilter) {
}