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
    google.charts.setOnLoadCallback(drawRegionsMapOil(oil["response"]["data"]));
  });
}

function displayNaturalGasProduction() {
  let year = document.getElementById("gas-year").value;
  fetchNaturalGasData(year).then((gas) => {
    google.charts.setOnLoadCallback(drawRegionsMapNaturalGas(gas["response"]["data"])
    );
  });
}

function getOilProductionValue(data, stateNeeded) {
  for (const area of data) {
    const state = area["series-description"].split(" ")[0];
    if (stateNeeded === state) {
      if (area["units"] === "MBBL/D") {
        return area["value"] * 365;
      }
      if (area["units"] === "MBBL") {
        return area["value"];
      }
    }
  }
  return 0;
}

function getNaturalGasProductionValue(data, stateNeeded) {
  for (const area of data) {
    const state = area["series-description"].split(" ")[0];
    if (stateNeeded === state) {
      if (area["units"] === "MMCF") {
        return area["value"];
      }
    }
  }
  return 0;
}

async function timelapseOil() {
  for (let i = 1973; i <= 2021; i++) {
    fetchData(i).then((oil) => {
      google.charts.setOnLoadCallback(
        drawRegionsMapOil(oil["response"]["data"])
      );
    });
    await new Promise((r) => setTimeout(r, 2000));
  }
}

async function timelapseNaturalGas() {
  for (let i = 1967; i <= 2021; i++) {
    fetchData(i).then((gas) => {
      google.charts.setOnLoadCallback(
        drawRegionsMapNaturalGas(gas["response"]["data"])
      );
    });
    await new Promise((r) => setTimeout(r, 2000));
  }
}

fetchOilData(2021).then((oil) => {
  google.charts.setOnLoadCallback(drawRegionsMapOil(oil["response"]["data"]));
});

fetchNaturalGasData(2021).then((gas) => {
  google.charts.setOnLoadCallback(drawRegionsMapNaturalGas(gas["response"]["data"]));
});

function drawRegionsMapOil(data) {
  var data = google.visualization.arrayToDataTable([
    ["State", "Oil Production"],
    ["Alaska", getOilProductionValue(data, "Alaska")],
    ["Alabama", getOilProductionValue(data, "Alabama")],
    ["Arkansas", getOilProductionValue(data, "Arkansas")],
    ["American Samoa", getOilProductionValue(data, "American Samoa")],
    ["Arizona", getOilProductionValue(data, "Arizona")],
    ["California", getOilProductionValue(data, "California")],
    ["Colorado", getOilProductionValue(data, "Colorado")],
    ["Connecticut", getOilProductionValue(data, "Connecticut")],
    ["Delaware", getOilProductionValue(data, "Delaware")],
    ["Florida", getOilProductionValue(data, "Florida")],
    ["Georgia", getOilProductionValue(data, "Georgia")],
    ["Hawaii", getOilProductionValue(data, "Hawaii")],
    ["Iowa", getOilProductionValue(data, "Iowa")],
    ["Idaho", getOilProductionValue(data, "Idaho")],
    ["Illinois", getOilProductionValue(data, "Illinois")],
    ["Indiana", getOilProductionValue(data, "Indiana")],
    ["Kansas", getOilProductionValue(data, "Kansas")],
    ["Kentucky", getOilProductionValue(data, "Kentucky")],
    ["Louisiana", getOilProductionValue(data, "Louisiana")],
    ["Massachusetts", getOilProductionValue(data, "Massachusetts")],
    ["Maryland", getOilProductionValue(data, "Maryland")],
    ["Maine", getOilProductionValue(data, "Maine")],
    ["Michigan", getOilProductionValue(data, "Michigan")],
    ["Minnesota", getOilProductionValue(data, "Minnesota")],
    ["Missouri", getOilProductionValue(data, "Missouri")],
    ["Mississippi", getOilProductionValue(data, "Mississippi")],
    ["Montana", getOilProductionValue(data, "Montana")],
    ["North Carolina", getOilProductionValue(data, "North Carolina")],
    ["North Dakota", getOilProductionValue(data, "North Dakota")],
    ["Nebraska", getOilProductionValue(data, "Nebraska")],
    ["New Hampshire", getOilProductionValue(data, "New Hampshire")],
    ["New Jersey", getOilProductionValue(data, "New Jersey")],
    ["New Mexico", getOilProductionValue(data, "New Mexico")],
    ["Nevada", getOilProductionValue(data, "Nevada")],
    ["New York", getOilProductionValue(data, "New York")],
    ["Ohio", getOilProductionValue(data, "Ohio")],
    ["Oklahoma", getOilProductionValue(data, "Oklahoma")],
    ["Oregon", getOilProductionValue(data, "Oregon")],
    ["Pennsylvania", getOilProductionValue(data, "Pennsylvania")],
    ["Puerto Rico", getOilProductionValue(data, "Puerto Rico")],
    ["Rhode Island", getOilProductionValue(data, "Rhode Island")],
    ["South Carolina", getOilProductionValue(data, "South Carolina")],
    ["South Dakota", getOilProductionValue(data, "South Dakota")],
    ["Tennessee", getOilProductionValue(data, "Tennessee")],
    ["Texas", getOilProductionValue(data, "Texas")],
    ["Utah", getOilProductionValue(data, "Utah")],
    ["Virginia", getOilProductionValue(data, "Virginia")],
    ["Vermont", getOilProductionValue(data, "Vermont")],
    ["Washington", getOilProductionValue(data, "Washington")],
    ["Wisconsin", getOilProductionValue(data, "Wisconsin")],
    ["West Virginia", getOilProductionValue(data, "West Virginia")],
    ["Wyoming", getOilProductionValue(data, "Wyoming")],
  ]);

  var options = {
    region: 'US',
    displayMode: 'regions',
    resolution: 'provinces',
    chartArea: {
      width: '100%'
    },
    width: '100%',
  };

  var chart = new google.visualization.GeoChart(
    document.getElementById("regions_oil")
  );

  chart.draw(data, options);
}

function drawRegionsMapNaturalGas(data) {
  var data = google.visualization.arrayToDataTable([
    ["State", "Natural Gas Production"],
    ["Alaska", getNaturalGasProductionValue(data, "Alaska")],
    ["Alabama", getNaturalGasProductionValue(data, "Alabama")],
    ["Arkansas", getNaturalGasProductionValue(data, "Arkansas")],
    ["American Samoa", getNaturalGasProductionValue(data, "American Samoa")],
    ["Arizona", getNaturalGasProductionValue(data, "Arizona")],
    ["California", getNaturalGasProductionValue(data, "California")],
    ["Colorado", getNaturalGasProductionValue(data, "Colorado")],
    ["Connecticut", getNaturalGasProductionValue(data, "Connecticut")],
    ["Delaware", getNaturalGasProductionValue(data, "Delaware")],
    ["Florida", getNaturalGasProductionValue(data, "Florida")],
    ["Georgia", getNaturalGasProductionValue(data, "Georgia")],
    ["Hawaii", getNaturalGasProductionValue(data, "Hawaii")],
    ["Iowa", getNaturalGasProductionValue(data, "Iowa")],
    ["Idaho", getNaturalGasProductionValue(data, "Idaho")],
    ["Illinois", getNaturalGasProductionValue(data, "Illinois")],
    ["Indiana", getNaturalGasProductionValue(data, "Indiana")],
    ["Kansas", getNaturalGasProductionValue(data, "Kansas")],
    ["Kentucky", getNaturalGasProductionValue(data, "Kentucky")],
    ["Louisiana", getNaturalGasProductionValue(data, "Louisiana")],
    ["Massachusetts", getNaturalGasProductionValue(data, "Massachusetts")],
    ["Maryland", getNaturalGasProductionValue(data, "Maryland")],
    ["Maine", getNaturalGasProductionValue(data, "Maine")],
    ["Michigan", getNaturalGasProductionValue(data, "Michigan")],
    ["Minnesota", getNaturalGasProductionValue(data, "Minnesota")],
    ["Missouri", getNaturalGasProductionValue(data, "Missouri")],
    ["Mississippi", getNaturalGasProductionValue(data, "Mississippi")],
    ["Montana", getNaturalGasProductionValue(data, "Montana")],
    ["North Carolina", getNaturalGasProductionValue(data, "North Carolina")],
    ["North Dakota", getNaturalGasProductionValue(data, "North Dakota")],
    ["Nebraska", getNaturalGasProductionValue(data, "Nebraska")],
    ["New Hampshire", getNaturalGasProductionValue(data, "New Hampshire")],
    ["New Jersey", getNaturalGasProductionValue(data, "New Jersey")],
    ["New Mexico", getNaturalGasProductionValue(data, "New Mexico")],
    ["Nevada", getNaturalGasProductionValue(data, "Nevada")],
    ["New York", getNaturalGasProductionValue(data, "New York")],
    ["Ohio", getNaturalGasProductionValue(data, "Ohio")],
    ["Oklahoma", getNaturalGasProductionValue(data, "Oklahoma")],
    ["Oregon", getNaturalGasProductionValue(data, "Oregon")],
    ["Pennsylvania", getNaturalGasProductionValue(data, "Pennsylvania")],
    ["Puerto Rico", getNaturalGasProductionValue(data, "Puerto Rico")],
    ["Rhode Island", getNaturalGasProductionValue(data, "Rhode Island")],
    ["South Carolina", getNaturalGasProductionValue(data, "South Carolina")],
    ["South Dakota", getNaturalGasProductionValue(data, "South Dakota")],
    ["Tennessee", getNaturalGasProductionValue(data, "Tennessee")],
    ["Texas", getNaturalGasProductionValue(data, "Texas")],
    ["Utah", getNaturalGasProductionValue(data, "Utah")],
    ["Virginia", getNaturalGasProductionValue(data, "Virginia")],
    ["Vermont", getNaturalGasProductionValue(data, "Vermont")],
    ["Washington", getNaturalGasProductionValue(data, "Washington")],
    ["Wisconsin", getNaturalGasProductionValue(data, "Wisconsin")],
    ["West Virginia", getNaturalGasProductionValue(data, "West Virginia")],
    ["Wyoming", getNaturalGasProductionValue(data, "Wyoming")],
  ]);
  
  var options = {
    region: 'US',
    displayMode: 'regions',
    resolution: 'provinces',
    chartArea: {
      width: '100%'
    },
    width: '100%',
  };
  
  var chart = new google.visualization.GeoChart(
    document.getElementById("regions_gas")
  );
    
  chart.draw(data, options);
}
