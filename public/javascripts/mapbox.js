mapboxgl.accessToken =
  "pk.eyJ1Ijoibm9vZGxlaCIsImEiOiJja21sN2Q0cXgxODlzMm5uMDNxY2ZtdXZiIn0.9AY55KwvVZLEK7ZlXzHT4w";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 3,
  center: [-71.157895, 42.707741],
});

var navControl = new mapboxgl.NavigationControl();

let stores;

map.addControl(navControl, "top-left");

//function to get the store data from the databases
async function getStores() {
  //fetch data using this route
  const res = await fetch("/getbusinesses");
  //store data in json format
  const data = await res.json();

  //store the data and
  stores = data.data.map((store) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          store.businessLocation.coordinates[0],
          store.businessLocation.coordinates[1],
        ],
      },
      properties: {
        icon: "shop",
        storeId: store._id,
        storeName: store.businessName,
        storeOwner: store.businessOwner.name,
      },
    };
  });
  console.log(stores);
  loadMap(stores);
}

// Load map with stores
function loadMap(stores) {
  map.on("load", function () {
    map.addLayer({
      id: "points",
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: stores,
        },
      },
      layout: {
        "icon-image": "{icon}-15",
        "icon-size": 1.5,
        "text-field": "{storeName}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.9],
        "text-anchor": "top",
      },
    });
  });

  //function to make the points on the map clickable
  map.on("click", "points", function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.storeName;
    const owner = e.features[0].properties.storeOwner;
    const storeId = e.features[0].properties.storeId;
    
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat - coordinates[0]) > 180) {
      coordinates[0] == e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup().setLngLat(coordinates).setHTML('<h1>' + description + '</h1>' + '<p> Business Owner: ' + owner + '</p>' + "<a href=/business/" + storeId + "> Store Link </a>").addTo(map);
  });

  //function to turn the cursor into a pointer when hovering over a point.
  map.on("mouseenter", "points", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  //function to remove the pointer when moving away from a point.
  map.on("mouseleave", "points", function () {
    map.getCanvas().style.cursor = "";
  });

}  

getStores();
