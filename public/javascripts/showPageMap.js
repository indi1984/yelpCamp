/* eslint-disable max-len */


mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

new mapboxgl.Marker({color: '#e00d1c'})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<div class="mt-3"><h4>${campground.title}</h4></div><p>${campground.location}</p>`))
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
