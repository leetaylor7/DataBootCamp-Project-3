// Creating map object
// center on US
let map = L.map("map", {
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

// get geoJSON file (stateboarder.json)
d3.json('stateboarder.json', function(data) {
    L.geoJSON(data, {
        style: function(feature) {
            return {
              color: "#ffffff",
              weight: 3.5
            };
        }
    }).addTo(map);
});