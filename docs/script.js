const states = [
  "Alaska",
  "Alabama",
  "Arkansas",
  "American Samoa",
  "Arizona",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Iowa",
  "Idaho",
  "Illinois",
  "Indiana",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Massachusetts",
  "Maryland",
  "Maine",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Mississippi",
  "Montana",
  "North Carolina",
  "North Dakota",
  "Nebraska",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "Nevada",
  "New York",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Virginia",
  "Vermont",
  "Washington",
  "Wisconsin",
  "West Virginia",
  "Wyoming",
];

let oilNumbers = new Map();
for (let state of states) {
  oilNumbers.set(state, 0);
}

let naturalGasNumbers = new Map();
for (let state of states) {
  naturalGasNumbers.set(state, 0);
}

google.charts.load("current", {
  packages: ["geochart"],
});

async function fetchOilData(year) {
  const response = await fetch(
    `https://api.eia.gov/v2/petroleum/crd/crpdn/data/?api_key=vVQCezbMDFZDw6SCxKutg7fpk43er3EOXsZuEWI0&start=${year}&end=${year}&data[]=value`
  );
  const oilProduction = await response.json();
  return oilProduction;
}

async function fetchNaturalGasData(year) {
  const response = await fetch(
    `https://api.eia.gov/v2/natural-gas/prod/whv/data/?api_key=vVQCezbMDFZDw6SCxKutg7fpk43er3EOXsZuEWI0&start=${year}&end=${year}&data[]=value`
  );
  const gasProduction = await response.json();
  return gasProduction;
}

function displayOilProduction() {
  let year = document.getElementById("oil-year").value;
  fetchOilData(year).then((oil) => {
    google.charts.setOnLoadCallback(
      drawRegionsMapOil(states, oil["response"]["data"], oilNumbers)
    );
  });
}

function displayNaturalGasProduction() {
  let year = document.getElementById("gas-year").value;
  fetchNaturalGasData(year).then((gas) => {
    google.charts.setOnLoadCallback(
      drawRegionsMapNaturalGas(
        states,
        gas["response"]["data"],
        naturalGasNumbers
      )
    );
  });
}

function getOilProductionValue(data, stateNeeded) {
  for (const area of data) {
    const state = area["series-description"].split(" ")[0];
    if (stateNeeded === state) {
      if (area["units"] === "MBBL/D") {
        if (area["value"] !== null) return area["value"] * 365;
      }
      if (area["units"] === "MBBL") {
        if (area["value"] !== null) return area["value"];
      }
    }
  }
  return 0;
}

function getNaturalGasProductionValue(data, stateNeeded) {
  for (const area of data) {
    if (area["process-name"] === "Marketed Production") {
      const state = area["series-description"].split(" ")[0];
      if (stateNeeded === state) {
        if (area["units"] === "MMCF") {
          if (area["value"] !== null) return area["value"];
        }
      }
    }
  }
  return 0;
}

async function timelapseOil() {
  for (let i = 1973; i <= 2021; i++) {
    fetchOilData(i).then((oil) => {
      google.charts.setOnLoadCallback(
        drawRegionsMapOil(states, oil["response"]["data"], oilNumbers)
      );
    });
    await new Promise((r) => setTimeout(r, 2000));
  }
}

async function timelapseNaturalGas() {
  for (let i = 1967; i <= 2021; i++) {
    fetchNaturalGasData(i).then((gas) => {
      google.charts.setOnLoadCallback(
        drawRegionsMapNaturalGas(
          states,
          gas["response"]["data"],
          naturalGasNumbers
        )
      );
    });
    await new Promise((r) => setTimeout(r, 2000));
  }
}

fetchOilData(2021).then((oil) => {
  google.charts.setOnLoadCallback(
    drawRegionsMapOil(states, oil["response"]["data"], oilNumbers)
  );
});

fetchNaturalGasData(2021).then((gas) => {
  google.charts.setOnLoadCallback(
    drawRegionsMapNaturalGas(states, gas["response"]["data"], naturalGasNumbers)
  );
});

function drawRegionsMapOil(states, data, oilListVals) {
  var rawData = [];
  rawData.push(["State", "Oil Production"]);

  for (const state of states) {
    let oilProductionValue = getOilProductionValue(data, state);
    oilListVals.set(state, oilProductionValue);
    rawData.push([state, oilProductionValue]);
  }

  var data = google.visualization.arrayToDataTable(rawData);

  var options = {
    region: "US",
    displayMode: "regions",
    resolution: "provinces",
    chartArea: {
      width: "94%",
    },
    legend: {
      position: "top",
    },
    width: "100%",
  };

  var chart = new google.visualization.GeoChart(
    document.getElementById("regions_oil")
  );

  chart.draw(data, options);
}

function drawRegionsMapNaturalGas(states, data, natGasListVals) {
  var rawData = [];
  rawData.push(["State", "Natural Gas Production"]);

  for (const state of states) {
    let naturalGasProductionValue = getNaturalGasProductionValue(data, state);
    natGasListVals.set(state, naturalGasProductionValue);
    rawData.push([state, naturalGasProductionValue]);
  }

  var data = google.visualization.arrayToDataTable(rawData);

  var options = {
    region: "US",
    displayMode: "regions",
    resolution: "provinces",
    chartArea: {
      width: "94%",
    },
    legend: {
      position: "top",
    },
    width: "100%",
  };

  var chart = new google.visualization.GeoChart(
    document.getElementById("regions_gas")
  );

  chart.draw(data, options);
}
