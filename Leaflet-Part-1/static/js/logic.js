// Prep to jsonify the data chosen
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
    console.log(data.features);

  // Pass the features to a createFeatures() function:
  createFeatures(data.features);

});

function markerSize(magnitude) {
  return magnitude * 25000;
};

function chooseColor(depth) {
  if (depth < 10) return "#D7FD63";
  else if (depth < 30) return "#CFCA4F";
  else if (depth < 50) return "#C7983B";
  else if (depth < 70) return "#C06528";
  else if (depth < 90) return "#B83314";
  else return "#B00000";
}

function createFeatures(earthquakeData) { 

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place},</h3> <hr> <p>Date: ${new Date(feature.properties.time)}</p> <p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Save the earthquake data in a variable.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature,latlng) {
      let markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.8,
        color: "black",
        stroke: true,
        weight:1
      }
      return L.circle(latlng,markers)
    }
  });

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
  
    let colors = ["#D7FD63","#CFCA4F","#C7983B","#C06528","#B83314","#B00000"];
    let limits = [0,10,30,50,70,90];

      let legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        let legendLimits = limits;
        let legendColors = colors;
        let labels = [];

        // Title for the Legend
        let legendInfo = "<h1>Depth of Earthquake</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;
  
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };

      // Adding the legend to the map
      legend.addTo(earthquakes);

};
