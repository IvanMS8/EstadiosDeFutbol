// Configura el mapa con Leaflet y centra la vista en Bolivia
let map = L.map('map').setView([45.97361166668998, 11.803607668430969], 4);

// Agrega una capa de satélite gratuita de Esri
L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  maxZoom: 20
}).addTo(map);

// Configura el cambio de ubicación al seleccionar una universidad
document.getElementById('select-location').addEventListener('change', function (e) {
  let coords = e.target.value.split(",");
  map.flyTo(coords, 17);
});
