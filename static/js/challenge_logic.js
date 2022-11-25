//validate code check (uncomment for troubleshooting) 
//console.log("Hello Dave!"); 

//create the streets tile layer
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the satellite streets view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

//Create outdoors tile layer to be an option on the map. 
let outdoorsMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

//Create a base layer that holds both maps. 
let baseMaps = {
    "Streets": streets, 
    "Satellite": satelliteStreets, 
    "Outdoors": outdoorsMap
};

//Create the earthquake layer for the map. 
let earthquakes = new L.layerGroup(); 
//Create a tectonic plate data layer Step 1 
let plates = new L.layerGroup(); 
//create a major quake data layer 
let mquakes = new L.layerGroup(); 

//define an object that contains the overlays: 
//visible at all times 
let overlays = {
  Earthquakes: earthquakes, 
  Plates: plates,  //Deliverable 1
  "Major Events": mquakes//deliverable 2 
}; 

//create the map object with center, zoom level and default layer
let map = L.map('mapid', {
    center: [39.5, -98.5], 
    zoom: 3, 
    layers: [streets]
    }); 

//pass map layers into layer control and add layer control to the map. 
L.control.layers(baseMaps, overlays ).addTo(map); 

//retrieve earthquake GeoJSON data 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
   //creating a geoJson layer with retrieved data. 
   L.geoJson(data, {
    //turn each feature into a circle marker on the map
  // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
    //console.log(data); //uncomment for troubleshooting 
    return L.circleMarker(latlng);
    },
    style: styleInfo, 
    //create a popup for each marker to display 
    //magnitude and location 
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br> Location: " + feature.properties.place); 
    }
    }).addTo(earthquakes);
    //add the earthquake layer to the map. 
    earthquakes.addTo(map); 

    //create a legend control object 
    let legend = L.control({
      position: "bottomright"
    });

    // Then add all the details for the legend.
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      const magnitudes = [0, 1, 2, 3, 4, 5];
      const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
      // Looping through  intervals to generate a label with a colored square for each interval.
      for (var i = 0; i < magnitudes.length; i++) {
        // console.log(colors[i]); //Uncomment for troubleshooting
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
        }
      return div;
        };

      legend.addTo(map); 
 
    // This function returns the style data for each of the earthquakes we plot on
    // the map. We pass the magnitude of the earthquake into a function
    // to calculate the radius.
    function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),//tells the code where to get the mag value 
      stroke: true,
      weight: 0.5
    };

    function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 4;
      }
    //function that defines style of major quake layer. 

    //write conditional expression function for color selection
    function getColor(magnitude) {
      if (magnitude > 5) {
        return "#ea2c2c";
      }
      if (magnitude > 4) {
        return "#ea822c";
      }
      if (magnitude > 3) {
        return "#ee9c00";
      }
      if (magnitude > 2) {
        return "#eecc00";
      }
      if (magnitude > 1) {
        return "#d4ee00";
      }
      return "#98ee00";
    }   
  }; 

  //Step 7 - style lines with a color and weight that make it stand out
  let plateStyle = {
    color: "white", 
    weight: 4
  }

  //pull tectonic plate information from GitHub file repo
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json").then(function(data) {
  //set plate Polygon structure 
  let tPlate = [{
    "type": "Feature", 
    "geometry": {
      "type": "Polygon", 
      "coordinates": ["coordinates"] 
    }
  }]; 
  //pass plate data to GeoJSON Layer
  L.geoJSON(data , {
    pointToLayer: function(tPlate) {
      console.log(">>>>PLATE TEST<<<<"); 
      }, 
    style: plateStyle, 
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Plate Name:" + feature.properties.PlateName)
      //add to plates layer 
    }}).addTo(plates); 
      // add to map 
    plates.addTo(map); 
  }); 

  function majorStyleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getMajorColor(feature.properties.mag),
      color: "#000000",
      radius: getMajorRadius(feature.properties.mag),//tells the code where to get the mag value 
      stroke: true,
      weight: 0.5
      };}
  
  //Function that defines radius of major quake layer. 
  function getMajorRadius(magnitude) {
    if (magnitude > 6) {
      return magnitude * 6;
      }; 
    if (magnitude > 5) {
    return magnitude * 5;
      }; 
    return magnitude * 3; 
  }; 

  //function that defines colors for major quake layer. 
  function getMajorColor(magnitude) { 
    if (magnitude>6) {
      return "#ea2c2c"; 
    }
    if (magnitude>5) {
      return "#ea822c"; 
    }
    return "#ee9c00";
  };

//Pull major quake information from USGS Site 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data) {
  L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        //console.log ("Major Quake Data"); //Uncomment for troubleshooting
        return L.circleMarker(latlng); 
    },
    style: majorStyleInfo, 
    //create a popup for each marker to display 
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br> Location: " + feature.properties.place); 
    }    
  }).addTo(mquakes); 
  //console.log("Major Quake function testing") //uncomment for troubleshooting 
  //add major information to map.
  });
  mquakes.addTo(map);
});

//Deliverable One Rubric Review: 
// The tectonic plate data is added as a second layer group (10 pt) DONE
// The tectonic plate data is added to the overlay object (10 pt) DONE
// The d3.json() callback is working and does the following: (10 pt) DONE 
// The tectonic plate data is passed to the geoJSON() layer DONE
// The geoJSON() layer adds color and width to the tectonic plate lines DONE
// The tectonic layer group variable is added to the map DONE
// The earthquake data and tectonic plate data displayed on the map when the page loads (5 pt) DONE

//Deliverable Two Rubric Review: 
// The major earthquake data is added as a third layer group (10 pt) DONE 
// The major earthquake data is added to the overlay object (10 pt) DONE 
// The d3.json() callback is working and does the following: (25 pt) 
// Sets the color and diameter of each earthquake. DONE 
// The major earthquake data is passed to the geoJSON() layer. DONE 
// The geoJSON() layer creates a circle for each major earthquake, and adds a popup for each circle to display the magnitude and location of the earthquake DONE
// The major earthquake layer group variable is added to the map DONE 
// All the earthquake data and tectonic plate data are displayed on the map when the page loads and the datasets can be toggled on or off (5 pt) DONE 

// Deliverable Three Rubric Review: 
// A third map tile layer is created (5 pt) DONE - Outside layer 
// The third map is added to the overlay object (5 pt) DONE 
// All the earthquake data and tectonic plate data are displayed on the all maps of the webpage (5 pt) DONE 