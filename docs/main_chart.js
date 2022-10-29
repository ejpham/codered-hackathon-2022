google.charts.load('current', {
	'packages':['geochart'],
});

google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
	var data = google.visualization.arrayToDataTable([
		['State', 'Popularity'],
		['Texas', 100],
		['Alabama', 80],
		['Arizona', 60],
		['New York', 40],
		['California', 20]
	]);

	var options = {
		region: 'US',
		displayMode: 'regions',
		resolution: 'provinces'
	};

	var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

	chart.draw(data, options);
}
