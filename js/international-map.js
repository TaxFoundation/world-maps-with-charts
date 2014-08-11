// Global variables
// These control the data, color scales, sizes, the legend scale, etc.
var dataPath = "data/international-corporate-tax-rate-2014.json",
    topojsonPath = "data/world-50m.json",
// Dimension variables
    margin = {top: 20, left: 20, bottom: 20, right: 20},
    width = 600,
    height = 370,
    scalar = 5.75,
    chartHeight = 300,
// Set default year for mapping
    startingYear = 1993,
    endingYear = 2014,
    yearList = d3.range(startingYear,endingYear+1).reverse(),
// Set default country for charting
    defaultCountry = 840, //America
// Set the fill colors
    defaultFill = "#ccc",
    defaultStroke = "#fff",
    defaultStrokeWidth = 0.5,
    lowColor = "#f9ffcd",
    highColor = "#550909",
// Legend variables
    steps = 8,
    min = 0,
    max = 0.4,

// Helper variables and functions
// These define the structure and create useful functions that are frequently called
    color = d3.scale.linear()
      .domain([min,max])
      .range([lowColor, highColor])
      .interpolate(d3.interpolateHsl),
    dataFormat = {
      "dollar": d3.format("$,"),
      "percent": d3.format("%"),
      "percentPlusOneDecimal": d3.format("0.1%")
    },
    tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0),
// Define map variables
    projection = d3.geo.naturalEarth()
      .scale(width/scalar)
      .translate([width/2,((height/2)-30)]),
    path = d3.geo.path()
      .projection(projection),
    mapTitle = function(year){return "Corporate Taxes Around the World in " + year;},
    mapH2 = d3.select("#map-container")
      .append("h2")
      .attr("id", "map-title")
      .text(mapTitle(endingYear)),
    mapMenu = d3.select("#map-container")
      .append("form"),
    mapSvg = d3.select("#map-container").append("svg")
      .attr("width", width)
      .attr("height", height),
    worldMap = mapSvg.append("g").attr("id", "map"),
    legend = mapSvg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")"),
// Define chart variables
    chartTitle = function(country){
      return country + " Corporate Taxes from " + startingYear + " to " + endingYear;
    },
    chartH2 = d3.select("#chart-container")
      .append("h2")
      .attr("id", "chart-title")
      .text(chartTitle("United States")),
    chartMenu = d3.select("#chart-container")
      .append("form"),
    chartSvg = d3.select("#chart-container").append("svg")
      .attr("width", width)
      .attr("height", height),
    chart = chartSvg.append("g").attr("id", "chart"),
    // Define chart scales
    x = d3.scale.ordinal()
      .rangeRoundBands([100,width-margin.right], 0.1),
    y = d3.scale.linear()
      .range([(chartHeight-margin.bottom - margin.top), 25]);

// This is a list of countries for creating a menu. It may not be appropriate for all data sets.
var countryList = {4: "Afghanistan", 248: "Åland Islands", 8: "Albania", 12: "Algeria", 16: "American Samoa", 20: "Andorra", 24: "Angola", 660: "Anguilla", 10: "Antarctica", 28: "Antigua And Barbuda", 32: "Argentina", 51: "Armenia", 533: "Aruba", 36: "Australia", 40: "Austria", 31: "Azerbaijan", 44: "Bahamas", 48: "Bahrain", 50: "Bangladesh", 52: "Barbados", 112: "Belarus", 56: "Belgium", 84: "Belize", 204: "Benin", 60: "Bermuda", 64: "Bhutan", 68: "Bolivia", 70: "Bosnia And Herzegovina", 72: "Botswana", 74: "Bouvet Island", 76: "Brazil", 86: "British Indian Ocean Territory", 96: "Brunei Darussalam", 100: "Bulgaria", 854: "Burkina Faso", 108: "Burundi", 116: "Cambodia", 120: "Cameroon", 124: "Canada", 132: "Cape Verde", 136: "Cayman Islands", 140: "Central African Republic", 148: "Chad", 152: "Chile", 156: "China", 162: "Christmas Island", 166: "Cocos (Keeling) Islands", 170: "Colombia", 174: "Comoros", 178: "Congo", 180: "Congo, The Democratic Republic Of The", 184: "Cook Islands", 188: "Costa Rica", 384: "Côte d'Ivoire", 191: "Croatia", 192: "Cuba", 196: "Cyprus", 203: "Czech Republic", 208: "Denmark", 262: "Djibouti", 212: "Dominica", 214: "Dominican Republic", 218: "Ecuador", 818: "Egypt", 222: "El Salvador", 226: "Equatorial Guinea", 232: "Eritrea", 233: "Estonia", 231: "Ethiopia", 238: "Falkland Islands (Malvinas)", 234: "Faroe Islands", 242: "Fiji", 246: "Finland", 250: "France", 254: "French Guiana", 258: "French Polynesia", 260: "French Southern Territories", 266: "Gabon", 270: "Gambia", 268: "Georgia", 276: "Germany", 288: "Ghana", 292: "Gibraltar", 300: "Greece", 304: "Greenland", 308: "Grenada", 312: "Guadeloupe", 316: "Guam", 320: "Guatemala", 831: "Guernsey", 324: "Guinea", 624: "Guinea-Bissau", 328: "Guyana", 332: "Haiti", 334: "Heard Island And Mcdonald Islands", 336: "Holy See (Vatican City State)", 340: "Honduras", 344: "Hong Kong", 348: "Hungary", 352: "Iceland", 356: "India", 360: "Indonesia", 364: "Iran, Islamic Republic Of", 368: "Iraq", 372: "Ireland", 833: "Isle Of Man", 376: "Israel", 380: "Italy", 388: "Jamaica", 392: "Japan", 832: "Jersey", 400: "Jordan", 398: "Kazakhstan", 404: "Kenya", 296: "Kiribati", 408: "Korea, Democratic People's Republic Of", 410: "Korea, Republic Of", 414: "Kuwait", 417: "Kyrgyzstan", 418: "Lao People'S Democratic Republic", 428: "Latvia", 422: "Lebanon", 426: "Lesotho", 430: "Liberia", 434: "Libya", 438: "Liechtenstein", 440: "Lithuania", 442: "Luxembourg", 446: "Macao", 807: "Macedonia, The Former Yugoslav Republic Of", 450: "Madagascar", 454: "Malawi", 458: "Malaysia", 462: "Maldives", 466: "Mali", 470: "Malta", 584: "Marshall Islands", 474: "Martinique", 478: "Mauritania", 480: "Mauritius", 175: "Mayotte", 484: "Mexico", 583: "Micronesia, Federated States Of", 498: "Moldova, Republic Of", 492: "Monaco", 496: "Mongolia", 500: "Montserrat", 504: "Morocco", 508: "Mozambique", 104: "Myanmar", 516: "Namibia", 520: "Nauru", 524: "Nepal", 528: "Netherlands", 530: "Netherlands Antilles", 540: "New Caledonia", 554: "New Zealand", 558: "Nicaragua", 562: "Niger", 566: "Nigeria", 570: "Niue", 574: "Norfolk Island", 580: "Northern Mariana Islands", 578: "Norway", 512: "Oman", 586: "Pakistan", 585: "Palau", 275: "Palestine, State of", 591: "Panama", 598: "Papua New Guinea", 600: "Paraguay", 604: "Peru", 608: "Philippines", 612: "Pitcairn", 616: "Poland", 620: "Portugal", 630: "Puerto Rico", 634: "Qatar", 638: "Réunion", 642: "Romania", 643: "Russian Federation", 646: "Rwanda", 654: "Saint Helena, Ascension and Tristan da Cunha", 659: "Saint Kitts And Nevis", 662: "Saint Lucia", 666: "Saint Pierre And Miquelon", 670: "Saint Vincent And The Grenadines", 882: "Samoa", 674: "San Marino", 678: "Sao Tome And Principe", 682: "Saudi Arabia", 686: "Senegal", 891: "Serbia And Montenegro", 690: "Seychelles", 694: "Sierra Leone", 702: "Singapore", 703: "Slovakia", 705: "Slovenia", 90: "Solomon Islands", 706: "Somalia", 710: "South Africa", 239: "South Georgia And The South Sandwich Islands", 724: "Spain", 144: "Sri Lanka", 729: "Sudan", 740: "Suriname", 744: "Svalbard And Jan Mayen", 748: "Swaziland", 752: "Sweden", 756: "Switzerland", 760: "Syrian Arab Republic", 158: "Taiwan", 762: "Tajikistan", 834: "Tanzania, United Republic Of", 764: "Thailand", 626: "Timor-Leste", 768: "Togo", 772: "Tokelau", 776: "Tonga", 780: "Trinidad And Tobago", 788: "Tunisia", 792: "Turkey", 795: "Turkmenistan", 796: "Turks And Caicos Islands", 798: "Tuvalu", 800: "Uganda", 804: "Ukraine", 784: "United Arab Emirates", 826: "United Kingdom", 840: "United States", 581: "United States Minor Outlying Islands", 858: "Uruguay", 860: "Uzbekistan", 548: "Vanuatu", 862: "Venezuela, Bolivarian Republic of", 704: "Viet Nam", 92: "Virgin Islands, British", 850: "Virgin Islands, U.S.", 876: "Wallis And Futuna", 732: "Western Sahara", 887: "Yemen", 894: "Zambia", 716: "Zimbabwe"};

// Build everything the first time.
queue()
    .defer(d3.json, topojsonPath)
    .defer(d3.json, dataPath)
    .await(ready);

function ready(error, world, tax){
  if (error) return console.error(error);

  createYearMenu();
  drawMap(world, tax, endingYear);
  drawLegend();

  createChartMenu();
  drawChart(defaultCountry, tax);
}

// Functions for assembling the graphics and changing them.
function createYearMenu(){
  mapMenu.append("label")
    .text("Choose a year: ")
    .append("select")
    .attr("id", "years")
    .attr("onChange", "updateMap(this.value)")
    .selectAll("option")
    .data(yearList)
  .enter()
    .append("option")
    .attr("value", function(d){return d;})
    .text(function(d){return d;});
}

function drawMap(world, tax, year){
  //Draw the map
  worldMap.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
  .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d){ return addFill(tax, d.id, year); })
    .attr("stroke", defaultStroke)
    .attr("stroke-width", defaultStrokeWidth)
    .attr("cursor", "pointer")
    .attr("onmouseup", function(d){return "countrySelect(" + d.id + ")";})
    .attr("class", "country")
    .attr("id", function(d){return "country" + d.id;})
    .attr("value", function(d){return d.id;})
    .on("mouseover", function(d){return addTooltip(tax, d.id, year);})
    .on("mouseout", function(d){tooltip.transition().duration(200).style("opacity",0);});

  // Create stroke around map
  worldMap.append("path")
    .datum(d3.geo.graticule().outline)
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", defaultFill)
    .attr("stroke-width", "2px");
}

function updateMap(year){
  //Add updating of tooltips
  mapH2.text(mapTitle(year));

  d3.json(dataPath, function(error, tax){
    if (error) return console.log(error);

    var mouseOver = function(d){return addTooltip(tax, d.id, year);};
    var countries = d3.keys(tax);

    for (var i = 0, y = countries.length, colorValue = defaultFill; i < y; i++){
      colorValue = addFill(tax, countries[i], year);
      worldMap.select("#country" + countries[i])
      .attr("fill", colorValue)
      .on("mouseover", mouseOver);
    }
  });
}

function drawLegend(){
  var legendData = [{"color": defaultFill, "label": "No Data"}],
      legendDomain = [],
      legendScale,
      legendAxis;

  for (var i = 0, fill, label; i < steps; i++){
    fill = color( (max-min) * (1/steps) * (i+1) );
    label = dataFormat.percent( (max-min) * (1/steps) * i) + " to " + dataFormat.percent( (max-min) * (1/steps) * (i+1) );
    if (i == steps-1) label += "+";
    legendData[i+1]= {"color": fill, "label": label};
  }

  for (var j = 0, x = legendData.length; j < x; j++){
    legendDomain.push(legendData[j].label);
  }

  legendScale = d3.scale.ordinal()
    .rangeRoundBands([margin.left,width-margin.right], 0.1)
    .domain(legendDomain);

  legendAxis = d3.svg.axis()
    .scale(legendScale)
    .orient("bottom");

  legend.call(legendAxis);

  legend.selectAll("rect")
    .data(legendData)
  .enter()
    .append("rect")
    .attr("x", function(d){return legendScale(d.label);})
    .attr("y", -30)
    .attr("height", 30)
    .attr("class", "legend-item")
    .transition()
    .duration(700)
    .attrTween("width", function(){return d3.interpolate(0,legendScale.rangeBand());})
    .attrTween("fill", function(d){return d3.interpolate("#fff",d.color);});
}

function createChartMenu(){
  function compare(a,b){
    if (a.value < b.value)
      return -1;
    if (a.value > b.value)
      return 1;
    return 0;
  }
  chartMenu.append("label")
    .text("Choose a country: ")
    .append("select")
    .attr("id", "countries")
    .attr("onChange", "updateChart(this.value)")
    .selectAll("option")
    .data(d3.entries(countryList).sort(compare))
  .enter()
    .append("option")
    .attr("value", function(d){return d.key;})
    .attr("selected", function(d){ if(d.key == 840) { return "selected"; } })
    .text(function(d){return d.value;});
}

function drawChart(country, barData){
  x.domain(yearList.reverse());
  y.domain([0, 0.6]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("%"));

  // Create axes
  chartSvg.append("g")
  .attr("class", "x axis")
    .attr("transform", "translate(0," + (chartHeight - margin.bottom - margin.top) + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "translate(-5,5) rotate(315)");

  chartSvg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + 100 + ",0)")
    .call(yAxis);

  // Create bars
  var dataBars = chartSvg.selectAll(".bar").data(d3.entries(barData[country]))
    .enter().append("rect")
      .attr("class", "bar")
      .attr("value", function(d){return d.key;})
      .attr("x", function(d){return x(d.key);})
      .attr("y", function(d){return chartHeight-margin.bottom-margin.top;})
      .attr("width", x.rangeBand())
      .attr("height", 0)
      .attr("fill", function(d){return color(d.value);})
      .attr("cursor", "pointer")
      .on("mouseover", function(d){return addTooltip(barData, country, d.key);})
      .on("mouseout", function(d){tooltip.transition().duration(200).style("opacity",0);});
  // Animate bars
  dataBars.transition()
      .duration(700)
      .attr("y", function(d){return y(Math.max(0, d.value));})
      .attr("height", function(d){return Math.abs(y(d.value) - y(0));});
}

function updateChart(country){
  d3.json(dataPath, function(error, barData){
    if (error) return console.log(error);

    var dataBars = chartSvg.selectAll(".bar")
      .data(d3.entries(barData[country]))
    .on("mouseover", function(d){return addTooltip(barData, country, d.key);});

    dataBars
      .transition()
      .duration(350)
      .attr("y", chartHeight-margin.bottom-margin.top)
      .attr("height", 0);
    // Animate bars
    dataBars
      .transition()
      .duration(350)
      .attr("y", function(d){return y(Math.max(0, d.value));})
      .attr("height", function(d){return Math.abs(y(d.value) - y(0));})
      .attr("fill", function(d){return color(d.value);});
  });
}

function addTooltip(data, country, year){
  tooltip.transition()
    .duration(200)
    .style("opacity", 0.9);
  tooltip.html(
    (data[country] && data[country][year]) ? countryList[country] + ": " + dataFormat.percentPlusOneDecimal(data[country][year]) : "No Data"
  )
    .style("left", (d3.event.pageX - 50) + "px")
    .style("top", (d3.event.pageY - 25) + "px");
}

function addFill(data, country, year){
  if (data[country] && data[country][year]) {
    return color(data[country][year]);
  } else {
    return defaultFill;
  }
}