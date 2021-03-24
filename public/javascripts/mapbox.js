mapboxgl.accessToken =
  "pk.eyJ1Ijoibm9vZGxlaCIsImEiOiJja21sN2Q0cXgxODlzMm5uMDNxY2ZtdXZiIn0.9AY55KwvVZLEK7ZlXzHT4w";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 3,
  center: [-71.157895, 42.707741],
});

//function to get the store data from the databases
async function getStores() {
  //fetch data using this route
  const res = await fetch("/getbusinesses");
  //store data in json format
  const data = await res.json();

  //store the data and 
  const stores = data.data.map((store) => {
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
        storeId: store.businessName
      },
    };
  });

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
        "text-field": "{storeId}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.9],
        "text-anchor": "top",
      },
    });
  });
}

getStores();
