const locations = JSON.parse(document.getElementById("map").dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGV2ZWxvcGVybm9kZTIzIiwiYSI6ImNsY2piempwbDA0aW8zcW1xeXM4ZXhyN3kifQ.tvzLCnqB5pr9vnP0tbjr_Q";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/developernode23/clckuofg6001b14t2h3vgbu2l",
  scrollZoom:false 
  // center:[-118.113491,34.111745],
  // zoom:10,
  // interactive:false,
});
 
const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create Marker
  const el = document.createElement("div");
  el.className = "marker";

  // Add Marker
  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates,)
    .addTo(map);

  
  //Add Popup
  
  new mapboxgl.Popup({
    offset:30
  }).setLngLat(loc.coordinates)
  .setHTML(`<p>Day ${loc.day}:${loc.description}</p>`)
  .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
