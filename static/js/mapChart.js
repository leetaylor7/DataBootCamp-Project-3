// Creating map object
// center on US
let map = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
  });

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={key}", {
    id: "mapbox.streets",
    key: API_KEY
  }).addTo(map);