const map = L.map('map', {
  zoomControl: true,
  scrollWheelZoom: true,
  dragging: true,
  touchZoom: true,
  doubleClickZoom: true,
  boxZoom: true,
  keyboard: true
});

// Vista inicial de España
const spainBounds = L.latLngBounds(
  [35.8, -9.8],
  [43.9, 4.9]
);

// Capa satelital
L.tileLayer(
  'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
  }
).addTo(map);

function setInitialSpainView() {
  map.fitBounds(spainBounds, {
    padding: [20, 20]
  });
}

const teamButtons = document.querySelectorAll('.btn-university');

let currentMarker = null;
let currentSelectionId = 0;
let popupTimer = null;

function isMobileView() {
  return window.innerWidth <= 991;
}

function getTargetZoom() {
  return isMobileView() ? 17 : 18;
}

function clearActiveButtons() {
  teamButtons.forEach((button) => {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  });
}

function ensureMapInteractions() {
  map.dragging.enable();
  map.scrollWheelZoom.enable();
  map.touchZoom.enable();
  map.doubleClickZoom.enable();
  map.boxZoom.enable();
  map.keyboard.enable();
}

function focusStadium(button) {
  const coordsAttr = button.getAttribute('data-coords');
  if (!coordsAttr) return;

  const coords = coordsAttr.split(',').map((value) => parseFloat(value.trim()));

  if (coords.length !== 2 || Number.isNaN(coords[0]) || Number.isNaN(coords[1])) {
    console.error('Coordenadas inválidas:', coordsAttr);
    return;
  }

  const latlng = [coords[0], coords[1]];
  const zoom = getTargetZoom();

  const teamName =
    button.getAttribute('data-team') ||
    button.querySelector('.btn-label')?.textContent.trim() ||
    'Estadio';

  const selectionId = ++currentSelectionId;

  clearActiveButtons();
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');

  if (popupTimer) {
    clearTimeout(popupTimer);
    popupTimer = null;
  }

  map.stop();
  map.closePopup();
  map.invalidateSize();
  ensureMapInteractions();

  if (currentMarker) {
    map.removeLayer(currentMarker);
    currentMarker = null;
  }

  currentMarker = L.marker(latlng).addTo(map);
  currentMarker.bindPopup(`<strong>${teamName}</strong>`, {
    autoPan: false,
    closeButton: true
  });

  map.flyTo(latlng, zoom, {
    animate: true,
    duration: 4.5
  });

  map.once('moveend', () => {
    if (selectionId !== currentSelectionId || !currentMarker) return;
    currentMarker.openPopup();
    ensureMapInteractions();
  });

  popupTimer = setTimeout(() => {
    if (selectionId !== currentSelectionId || !currentMarker) return;
    currentMarker.openPopup();
    ensureMapInteractions();
  }, 4000);

  if (isMobileView()) {
    const mapSection = document.querySelector('.map-wrapper');
    if (mapSection) {
      mapSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    setTimeout(() => {
      map.invalidateSize();
      ensureMapInteractions();
    }, 350);
  }
}

teamButtons.forEach((button) => {
  button.addEventListener('click', () => {
    focusStadium(button);
  });
});

window.addEventListener('load', () => {
  setTimeout(() => {
    map.invalidateSize();
    ensureMapInteractions();
    setInitialSpainView();
  }, 250);
});

window.addEventListener('resize', () => {
  setTimeout(() => {
    map.invalidateSize();
    ensureMapInteractions();
  }, 200);
});