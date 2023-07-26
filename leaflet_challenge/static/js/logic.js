function createMap(earthquakeData, tectonicPlatesData) {
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    function getMarkerColor(depth) {
      if (depth < 10) return "#00FF00";
      else if (depth < 30) return "#FFFF00";
      else if (depth < 50) return "#FFA500";
      else return "#FF0000";
    }
    function getMarkerSize(magnitude) {
      return magnitude * 5;
    }
    earthquakeData.features.forEach((quake) => {
      const coords = quake.geometry.coordinates;
      const depth = coords[2];
      const magnitude = quake.properties.mag;
      const circle = L.circleMarker([coords[1], coords[0]], {
        color: getMarkerColor(depth),
        fillColor: getMarkerColor(depth),
        fillOpacity: 0.7,
        radius: getMarkerSize(magnitude),
      }).addTo(map);
      circle.bindPopup(`
        <b>Location:</b> ${quake.properties.place}<br/>
        <b>Magnitude:</b> ${magnitude}<br/>
        <b>Depth:</b> ${depth}
      `);
    });
    const tectonicPlatesLayer = L.geoJSON(tectonicPlatesData, {
      style: {
        color: "#FF5733",
        weight: 2,
        opacity: 0.7,
      },
    }).addTo(map);
    const platesLegend = L.control({ position: "bottomright" });
    platesLegend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML += '<i style="background: #FF5733"></i> Tectonic Plates';
      return div;
    };
    platesLegend.addTo(map);
  }
  const earthquakeDataURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
  fetch(earthquakeDataURL)
    .then(response => response.json())
    .then(earthquakeData => {
      const tectonicPlatesURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json';
      fetch(tectonicPlatesURL)
        .then(response => response.json())
        .then(tectonicPlatesData => createMap(earthquakeData, tectonicPlatesData));
    });
  