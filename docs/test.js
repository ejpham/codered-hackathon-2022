function duck() {
    fetch('https://api.eia.gov/v2/petroleum/crd/crpdn/data/?api_key=vVQCezbMDFZDw6SCxKutg7fpk43er3EOXsZuEWI0&start=2021&data[]=value')
  .then((response) => response.json())
  .then((data) => console.log(data));
}

duck();
