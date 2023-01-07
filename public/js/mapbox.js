const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken='pk.eyJ1IjoiZGV2ZWxvcGVybm9kZTIzIiwiYSI6ImNsY2piempwbDA0aW8zcW1xeXM4ZXhyN3kifQ.tvzLCnqB5pr9vnP0tbjr_Q';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/developernode23/clckuofg6001b14t2h3vgbu2l',
  // center:[-118.113491,34.111745],
  // zoom:10,
  // interactive:false, 
});

const bounds = new mapboxgl.LatLngBounds();

locations.forEach(loc =>{
  // Add Marker
  const el = document.createElement('div');
  el.className = 'Marker';

  new mapboxgl.Marker({
    element :el,
    anchor :'bottom'
  }).setLngLat(loc.coordinates)
})