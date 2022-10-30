const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
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
google.charts.load("current", { packages: ["corechart"] });

async function fetchOilData(year) {
  const response = await fetch(
    `https://api.eia.gov/v2/petroleum/crd/crpdn/data/?api_key=vVQCezbMDFZDw6SCxKutg7fpk43er3EOXsZuEWI0&start=${year}&end=${year}&data[]=value`
  );
  const oilProduction = await response.json();
  return oilProduction;
}

async function fetchOilHistoryForState(state) {
  const response = await fetch(
    `https://api.eia.gov/v2/petroleum/crd/crpdn/data/?api_key=vVQCezbMDFZDw6SCxKutg7fpk43er3EOXsZuEWI0&data[]=value`
  );
  const oilProduction = await response.json();

  let history = new Map();
  for (let i = 1973; i <= 2021; i++) {
    history.set(i, 0);
  }
  for (const record of oilProduction["response"]["data"]) {
    if (
      record["series-description"] ==
      `${state} Field Production of Crude Oil (Thousand Barrels)`
    ) {
      history.set(record["period"], record["value"]);
      continue;
    }
    if (
      record["series-description"] ==
      `${state} Field Production of Crude Oil (Thousand Barrels per Day)`
    ) {
      history.set(record["period"], record["value"] * 365);
    }
  }
  return history;
}

// fetchOilHistoryForState("Texas").then((history) => {
//   console.log(history);
// });

async function fetchNaturalGasData(year) {
  const response = await fetch(
    `https://api.eia.gov/v2/natural-gas/prod/whv/data/?api_key=vVQCezbMDFZDw6SCxKutg7fpk43er3EOXsZuEWI0&start=${year}&end=${year}&data[]=value`
  );
  const gasProduction = await response.json();
  return gasProduction;
}

async function fetchNatGasHistoryForState(state) {
  const response = await fetch(
    `https://api.eia.gov/v2/natural-gas/prod/whv/data/?api_key=vVQCezbMDFZDw6SCxKutg7fpk43er3EOXsZuEWI0&data[]=value`
  );
  const natGasProduction = await response.json();

  let history = new Map();
  for (let i = 1967; i <= 2021; i++) {
    history.set(i, 0);
  }
  for (const record of natGasProduction["response"]["data"]) {
    if (
      record["series-description"] ==
      `${state} Natural Gas Marketed Production (MMcf)`
    ) {
      history.set(record["period"], record["value"]);
    }
  }
  return history;
}

// fetchNatGasHistoryForState("Texas").then((history) => {
//   console.log(history);
// });

function displayOilProduction() {
  let year = document.getElementById("oil-year").value;
  fetchOilData(year).then((oil) => {
    google.charts.setOnLoadCallback(
      drawRegionsMapOil(states, oil["response"]["data"], oilNumbers)
    );
    for (let state of states) {
      document.getElementById(state).innerText = oilNumbers.get(state);
    }
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
    for (let state of states) {
      document.getElementById(`${state}-gas`).innerText =
        naturalGasNumbers.get(state);
    }
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

// async function timelapseOil() {
//   for (let i = 1973; i <= 2021; i++) {
//     fetchOilData(i).then((oil) => {
//       google.charts.setOnLoadCallback(
//         drawRegionsMapOil(states, oil["response"]["data"], oilNumbers)
//       );
//     });
//     await new Promise((r) => setTimeout(r, 2000));
//   }
// }

// async function timelapseNaturalGas() {
//   for (let i = 1967; i <= 2021; i++) {
//     fetchNaturalGasData(i).then((gas) => {
//       google.charts.setOnLoadCallback(
//         drawRegionsMapNaturalGas(
//           states,
//           gas["response"]["data"],
//           naturalGasNumbers
//         )
//       );
//     });
//     await new Promise((r) => setTimeout(r, 2000));
//   }
// }

fetchOilData(2021).then((oil) => {
  google.charts.setOnLoadCallback(
    drawRegionsMapOil(states, oil["response"]["data"], oilNumbers)
  );
  for (let state of states) {
    document.getElementById(state).innerText = oilNumbers.get(state);
  }
});

fetchNaturalGasData(2021).then((gas) => {
  google.charts.setOnLoadCallback(
    drawRegionsMapNaturalGas(states, gas["response"]["data"], naturalGasNumbers)
  );
  for (let state of states) {
    document.getElementById(`${state}-gas`).innerText =
      naturalGasNumbers.get(state);
  }
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
      width: "100%",
    },
    width: "100%",
  };

  var chart = new google.visualization.GeoChart(
    document.getElementById("regions_oil")
  );

  chart.draw(data, options);

  google.visualization.events.addListener(chart, "select", selectHandler);

  function selectHandler() {
    var selection = chart.getSelection();
    var message = "";
    for (var i = 0; i < selection.length; i++) {
      var item = selection[i];
      message += Array.from(states)[item.row];
    }
    if (message == "") {
      message = "nothing";
    }

    if (message !== "nothing") {
      var rawlinedata = [];
      rawlinedata.push(["Year", message]);

      fetchOilHistoryForState(message).then((history) => {
        for (const x of history) {
          rawlinedata.push([x[0].toString(), x[1]]);
        }
        var linedata = google.visualization.arrayToDataTable(rawlinedata);

        var lineoptions = {
          title: `Oil Production History of ${message}`,
          legend: { position: "bottom" },
        };

        var linechart = new google.visualization.LineChart(
          document.getElementById("line_chart_oil")
        );

        linechart.draw(linedata, lineoptions);
      });
    }
  }
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
      width: "100%",
    },
    width: "100%",
  };

  var chart = new google.visualization.GeoChart(
    document.getElementById("regions_gas")
  );

  chart.draw(data, options);

  google.visualization.events.addListener(chart, "select", selectHandler);

  function selectHandler() {
    var selection = chart.getSelection();
    var message = "";
    for (var i = 0; i < selection.length; i++) {
      var item = selection[i];
      message += Array.from(states)[item.row];
    }
    if (message == "") {
      message = "nothing";
    }
    if (message !== "nothing") {
      var rawlinedata = [];
      rawlinedata.push(["Year", message]);

      fetchNatGasHistoryForState(message).then((history) => {
        for (const x of history) {
          rawlinedata.push([x[0].toString(), x[1]]);
        }
        var linedata = google.visualization.arrayToDataTable(rawlinedata);

        var lineoptions = {
          title: `Nat. Gas Production History of ${message}`,
          legend: { position: "bottom" },
        };

        var linechart = new google.visualization.LineChart(
          document.getElementById("line_chart_gas")
        );

        linechart.draw(linedata, lineoptions);
      });
    }
  }
}
