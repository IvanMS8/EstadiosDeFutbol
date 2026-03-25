// Configuración del mapa con Leaflet
let map = L.map('map').setView([10.345477125880862, 0.4398857379242001], 2); // Centrado en Bolivia

// Agregar una capa de satélite gratuita de Esri
L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  maxZoom: 17
}).addTo(map);

// Funcionalidad para los botones
document.querySelectorAll('.btn-university').forEach(button => {
  button.addEventListener('click', function () {
    let coords = this.getAttribute('data-coords').split(',');
    map.flyTo([parseFloat(coords[0]), parseFloat(coords[1])], 17);
  });
});
