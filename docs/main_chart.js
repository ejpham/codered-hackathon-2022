google.charts.load('current', {
	'packages':['geochart'],
});

google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
	var data = google.visualization.arrayToDataTable([
		['State', 'Oil Production'],
		['Alaska', 0],
		['Alabama', 0],
		['Arkansas', 0],
		['American Samoa', 0],
		['Arizona', 0],
		['California', 0],
		['Colorado', 0],
		['Connecticut', 0],
		['Delaware', 0],
		['Florida', 0],
		['Georgia', 0],
		['Hawaii', 0],
		['Iowa', 0],
		['Idaho', 0],
		['Illinois', 0],
		['Indiana', 0],
		['Kansas', 0],
		['Kentucky', 0],
		['Louisiana', 0],
		['Massachusetts', 0],
		['Maryland', 0],
		['Maine', 0],
		['Michigan', 0],
		['Minnesota', 0],
		['Missouri', 0],
		['Mississippi', 0],
		['Montana', 0],
		['North Carolina', 0],
		['North Dakota', 0],
		['Nebraska', 0],
		['New Hampshire', 0],
		['New Jersey', 0],
		['New Mexico', 0],
		['Nevada', 0],
		['New York', 0],
		['Ohio', 0],
		['Oklahoma', 0],
		['Oregon', 0],
		['Pennsylvania', 0],
		['Puerto Rico', 0],
		['Rhode Island', 0],
		['South Carolina', 0],
		['South Dakota', 0],
		['Tennessee', 0],
		['Texas', 100],
		['Utah', 0],
		['Virginia', 0],
		['Vermont', 0],
		['Washington', 0],
		['Wisconsin', 0],
		['West Virginia', 0],
		['Wyoming', 0]
	]);
	
	var options = {
		region: 'US',
		displayMode: 'regions',
		resolution: 'provinces',
		keepAspectRatio: true,
		width: 1280,
		height: 720
	};
	
	var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
	
	chart.draw(data, options);
}
