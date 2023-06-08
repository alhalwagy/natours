export const displayMap = (locationsData) => {
  var map = L.map('map').setView([31.111745, -118.113491], 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    crossOrigin: true,
  }).addTo(map);

  const markerArray = [];
  locationsData.forEach((loc) => {
    const reversedArr = [...loc.coordinates].reverse();

    const myIcon = L.icon({
      iconUrl: './../img/pin.png',
      iconSize: [30, 35],
      iconAnchor: [15, 35],
    });

    L.marker(reversedArr, { icon: myIcon }).addTo(map);
    markerArray.push(reversedArr);
  });
  const bounds = L.latLngBounds(markerArray);
  map.fitBounds(bounds);
};
