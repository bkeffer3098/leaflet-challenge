// Prep to jsonify the data chosen
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
    console.log(data.features);

  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});

function markerSize(magnitude) {
  return magnitude * 10;
};

function chooseColor(depth) {
  if (depth <= 2.5) return "white";
  else if (depth <= 5.4) return "gray";
  else if (depth <= 6) return "yellow";
  else if (depth <= 6.9) return "orange";
  else if (depth <= 7.9) return "red";
  else return "black";
}

function createFeatures(earthquakeData) { 

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place},</h3> <hr> <p>Date: ${new Date(feature.properties.time)}</p> <p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Save the earthquake data in a variable.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  })

  // Pass the earthquake data to a createMap() function.
  createMap(earthquakes);

}

// createMap() takes the earthquake data and incorporates it into the visualization:

function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street
    };
  
    // Create an overlays object.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create a new map.
    // Edit the code to add the earthquake data to the layers.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street,earthquakes]
    });
  
  };

  