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

