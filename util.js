const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const MINLAT = 8.06666667; // south
const MINLNG = 68.11666667; // west
const MAXLAT = 37.1; // north
const MAXLNG = 97.41666667; // east

// function to get distance between two points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);

  const a =
    dLat * dLat +
    dLon * dLon * Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // Distance in km
  console.log("distance: ", d);
  return d;
}

// degree to radian conversion
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function generateRandomPoints() {
  const lat = Math.random() * (MAXLAT - MINLAT) + MINLAT;
  const lng = Math.random() * (MAXLNG - MINLNG) + MINLNG;
  return { lat, lng };
}

function gridIndex(lat, lng) {
  const N = (MAXLAT - MINLAT) * 111.32;
  const M = (MAXLNG - MINLNG) * 111.32;
  const unitcell = 0.01;
  const i = Math.floor((lat - MINLAT) / unitcell);
  const j = Math.floor((lng - MINLNG) / unitcell);
  return {i, j};
}


function plot(x, y) {
  // plot points arround the given point
  const unitcell = 0.01; // 0.01 lat degrees == 1km approx
  const N = (MAXLAT - MINLAT) / unitcell;
  const M = (MAXLNG - MINLNG) / unitcell;
  const grid = [];
  const I = Math.floor((x - MINLAT) / unitcell);
  const J = Math.floor((y - MINLNG) / unitcell);
  console.log("I: ", I);
  console.log("J: ", J);
  for (let i = I - 5; i <= I + 5; i++) {
    for (let j = J - 5; j <= J + 5; j++) {
      if (i >= 0 && i < N && j >= 0 && j < M) {
        grid.push({ lat: i * unitcell + MINLAT, lng: j * unitcell + MINLNG });
      }
    }
  }
  // create a csv file to save the grid points
  const csvWriter = createCsvWriter({
    path: "squares2.csv",
    header: [
      { id: "num", title: "num" },
      { id: "lat", title: "LAT" },
      { id: "lng", title: "LNG" },
    ],
  });
  const data = [];
  for (let i = 0; i < grid.length; i++)
    data.push({ num: i, lat: grid[i].lat, lng: grid[i].lng });
  csvWriter.writeRecords(data).then(() => {
    console.log("The CSV file was written successfully!! 😀");
  });

  return grid;
}

module.exports = {
    getDistanceFromLatLonInKm,
    generateRandomPoints,
    gridIndex,
    plot
};


// --------------------------------------------- TEST CASES ---------------------------------------------

// gridIndex(12.5238, 80.1568); - kalpakkam
// gridIndex(9.756067, 76.649637); // iiit
// gridIndex(9.7129487,76.6831912); // pala


// res = getDistanceFromLatLonInKm(9.756067, 76.649637, 9.72206, 76.68359);

