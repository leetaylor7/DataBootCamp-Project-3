// Creating map object
// center on US
function secondChart(yearFilter, dataFilter, baseFilter, regionFilter) {

  var xData = [];
  var yData = [];
  var comp = [];
  var baseYData = [];
  var baseComp = [];
  let colorsObj = {};
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
for (var j = 0; j < dataKeys.length; j++) {
  relativeChange.push(((yData[j] / baseYData[j])-1));
 }


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
function getColor(feature) {
  // console.log(colorsObj[0]);
  return colorsObj[feature.properties.NAME];
}
var total = 0;
for (let i = 0; i < relativeChange.length; i++) {
  total += relativeChange[i];
}
var avg = total / relativeChange.length;

// holds geoJSON layer
let geoLay;
// function to 
// get geoJSON file (stateboarder.json = stateBorders) and lay out Leaflet map
    //  console.log('running updateC');
      for (let i = 0; i < relativeChange.length; i++) {
        let colorI;
        if (relativeChange[i] > avg) {
          colorI = '#00ff00';
        }else if (relativeChange[i] < avg) {
          colorI = '#ff0000';
        }else{
          colorI = '#000000';
        }
        colorsObj[xData[i]] = colorI;
      }
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
    // create legend
    // first make a few arrays to make it easier
    let limits = [Math.min(relativeChange), avg, Math.max(relativeChange)];
    let colors = ['#ff0000', '#000000', '#00ff00'];

    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        //create div
        let div = L.DomUtil.create("div", "info legend");
        let labels = [];

        // create min/max
        let legendInfo = "<h2>Color by Change #</h2>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + 'Below Average' + "</div>" +
          "<div class=\"max\">" + 'Above Average' + "</div>" +
        "</div>";
        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(map);
});
});
}

// ==========================================================================================================
// =====================================REFRESHED DATA MAP======================================
// ==========================================================================================================

function newmap(yearFilter, dataFilter, baseFilter, regionFilter) {
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////// These remove the existing chart and make a new one //////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
  d3.selectAll('#chart').remove();
  d3.selectAll('.thumbnail').append('div').attr('id', 'chart');
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
  var xData = [];
  var yData = [];
  var comp = [];
  var baseYData = [];
  var baseComp = [];
  let colorsObj = {};
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
for (var j = 0; j < dataKeys.length; j++) {
  relativeChange.push(((yData[j] / baseYData[j])-1));
 }


// let map = L.map("chart", {
//     center: [39.8283, -98.5795],
//     zoom: 4
// });



// placeholder for coloring function
//function chooseColor(state) {
//  CODE
//}

// create popup function
let getPopup = function(feature, layer) {
    let content = `<h1>${feature.properties.NAME}</h1>`;
    layer.bindPopup(content);
}
function getColor(feature) {
  // console.log(colorsObj[0]);
  return colorsObj[feature.properties.NAME];
}
var total = 0;
for (let i = 0; i < relativeChange.length; i++) {
  total += relativeChange[i]
}
var avg = total / relativeChange.length;

// holds geoJSON layer
let geoLay;
// function to 
// get geoJSON file (stateboarder.json = stateBorders) and lay out Leaflet map
    //  console.log('running updateC');
    for (let i = 0; i < relativeChange.length; i++) {
      let colorI;
      if (relativeChange[i] > avg) {
        colorI = '#00ff00';
      }else if (relativeChange[i] < avg) {
        colorI = '#ff0000';
      }else{
        colorI = '#000000';
      }
      colorsObj[xData[i]] = colorI;
    }
    let map = L.map("chart", {
      center: [39.8283, -98.5795],
      zoom: 4
    });
    // adding tile layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={key}", {
    id: "mapbox.streets",
    key: API_KEY
    }).addTo(map);
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
    let limits = [Math.min(relativeChange), avg, Math.max(relativeChange)];
    let colors = ['#ff0000', '#000000', '#00ff00'];
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        //create div
        let div = L.DomUtil.create("div", "info legend");
        let labels = [];

        // create min/max
        let legendInfo = "<h2>Color by Change #</h2>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + 'Below Average' + "</div>" +
          "<div class=\"max\">" + 'Above Average' + "</div>" +
        "</div>";
        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(map);
});
});

}


 //=============================================================
 //=============================================================
 //=============================================================

// initialization function
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selYear");
    var baseSelector = d3.select("#selBase")
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
    newmap(yearFilter, dataFilter, baseFilter, regionFilter);
}
function dataChanged(newData) {
    dataFilter.push(newData)
    var filterLength = dataFilter.length
    if (filterLength >= 2) {
      dataFilter.shift();
    }
    newmap(yearFilter, dataFilter, baseFilter, regionFilter);
}
function baseChanged(newBase) {
    baseFilter.push(newBase)
    var filterLength = baseFilter.length
    if (filterLength >= 2) {
      baseFilter.shift();
    }
    newmap(yearFilter, dataFilter, baseFilter, regionFilter);
}
function regionChanged(newRegion) {
    regionFilter.push(newRegion)
    var filterLength = regionFilter.length
    if (filterLength >= 2) {
      regionFilter.shift();
    }
    newmap(yearFilter, dataFilter, baseFilter, regionFilter);
}


init();