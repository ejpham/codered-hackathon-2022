google.charts.load("current", {
  packages: ["geochart"],
});

async function fetchData(year) {
  const response = await fetch(
    `https://api.eia.gov/v2/petroleum/crd/crpdn/data/?api_key=vVQCezbMDFZDw6SCxKutg7fpk43er3EOXsZuEWI0&start=${year}&end=${year}&data[]=value`
  );
  const oilProduction = await response.json();
  return oilProduction;
}

function displayOilProduction() {
  let year = document.getElementById("year").value;
  fetchData(year).then((oil) => {
    google.charts.setOnLoadCallback(drawRegionsMap(oil["response"]["data"]));
  });
}

fetchData(2021).then((oil) => {
  google.charts.setOnLoadCallback(drawRegionsMap(oil["response"]["data"]));
});

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

async function timelapse() {
  for (let i = 1973; i <= 2021; i++) {
    fetchData(i).then((oil) => {
      google.charts.setOnLoadCallback(drawRegionsMap(oil["response"]["data"]));
    });
    await new Promise((r) => setTimeout(r, 2000));
  }
}

// timelapse();

function drawRegionsMap(data) {
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
    region: "US",
    displayMode: "regions",
    resolution: "provinces",
    keepAspectRatio: true,
    width: 1400,
    height: 700,
  };

  var chart = new google.visualization.GeoChart(
    document.getElementById("regions_div")
  );

  chart.draw(data, options);
}
