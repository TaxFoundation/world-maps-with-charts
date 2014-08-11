/*
Dynamically updating world map and bar chart of IRS data on foreign taxes paid by US corporations.
Written for the Tax Foundation [taxfoundation.org] by Tom VanAntwerp [tomvanantwerp.com].
Utilizing the D3.js framework by Mike Bostock. [d3js.org]
Version 0.1.3
*/

// Global variables
var data_url = "data/international-corporate-tax-rate-2014.csv",
    topojson_url = "data/world-50m.json";

// Dimension variables
var margin = {top: 20, left: 20, bottom: 20, right: 20},
    width = 600,
    mapRatio = 0.75,
    chartHeight = 220,
    height = 370,
    scalar = 5.75;

// Array of all countries used and their ANSI code.
var countries = [[4, "Afghanistan"], [248, "Åland Islands"], [8, "Albania"], [12, "Algeria"], [16, "American Samoa"], [20, "Andorra"], [24, "Angola"], [660, "Anguilla"], [10, "Antarctica"], [28, "Antigua And Barbuda"], [32, "Argentina"], [51, "Armenia"], [533, "Aruba"], [36, "Australia"], [40, "Austria"], [31, "Azerbaijan"], [44, "Bahamas"], [48, "Bahrain"], [50, "Bangladesh"], [52, "Barbados"], [112, "Belarus"], [56, "Belgium"], [84, "Belize"], [204, "Benin"], [60, "Bermuda"], [64, "Bhutan"], [68, "Bolivia"], [70, "Bosnia And Herzegovina"], [72, "Botswana"], [74, "Bouvet Island"], [76, "Brazil"], [86, "British Indian Ocean Territory"], [96, "Brunei Darussalam"], [100, "Bulgaria"], [854, "Burkina Faso"], [108, "Burundi"], [116, "Cambodia"], [120, "Cameroon"], [124, "Canada"], [132, "Cape Verde"], [136, "Cayman Islands"], [140, "Central African Republic"], [148, "Chad"], [152, "Chile"], [156, "China"], [162, "Christmas Island"], [166, "Cocos (Keeling) Islands"], [170, "Colombia"], [174, "Comoros"], [178, "Congo"], [180, "Congo, The Democratic Republic Of The"], [184, "Cook Islands"], [188, "Costa Rica"], [384, "Côte d'Ivoire"], [191, "Croatia"], [192, "Cuba"], [196, "Cyprus"], [203, "Czech Republic"], [208, "Denmark"], [262, "Djibouti"], [212, "Dominica"], [214, "Dominican Republic"], [218, "Ecuador"], [818, "Egypt"], [222, "El Salvador"], [226, "Equatorial Guinea"], [232, "Eritrea"], [233, "Estonia"], [231, "Ethiopia"], [238, "Falkland Islands (Malvinas)"], [234, "Faroe Islands"], [242, "Fiji"], [246, "Finland"], [250, "France"], [254, "French Guiana"], [258, "French Polynesia"], [260, "French Southern Territories"], [266, "Gabon"], [270, "Gambia"], [268, "Georgia"], [276, "Germany"], [288, "Ghana"], [292, "Gibraltar"], [300, "Greece"], [304, "Greenland"], [308, "Grenada"], [312, "Guadeloupe"], [316, "Guam"], [320, "Guatemala"], [831, "Guernsey"], [324, "Guinea"], [624, "Guinea-Bissau"], [328, "Guyana"], [332, "Haiti"], [334, "Heard Island And Mcdonald Islands"], [336, "Holy See (Vatican City State)"], [340, "Honduras"], [344, "Hong Kong"], [348, "Hungary"], [352, "Iceland"], [356, "India"], [360, "Indonesia"], [364, "Iran, Islamic Republic Of"], [368, "Iraq"], [372, "Ireland"], [833, "Isle Of Man"], [376, "Israel"], [380, "Italy"], [388, "Jamaica"], [392, "Japan"], [832, "Jersey"], [400, "Jordan"], [398, "Kazakhstan"], [404, "Kenya"], [296, "Kiribati"], [408, "Korea, Democratic People's Republic Of"], [410, "Korea, Republic Of"], [414, "Kuwait"], [417, "Kyrgyzstan"], [418, "Lao People'S Democratic Republic"], [428, "Latvia"], [422, "Lebanon"], [426, "Lesotho"], [430, "Liberia"], [434, "Libya"], [438, "Liechtenstein"], [440, "Lithuania"], [442, "Luxembourg"], [446, "Macao"], [807, "Macedonia, The Former Yugoslav Republic Of"], [450, "Madagascar"], [454, "Malawi"], [458, "Malaysia"], [462, "Maldives"], [466, "Mali"], [470, "Malta"], [584, "Marshall Islands"], [474, "Martinique"], [478, "Mauritania"], [480, "Mauritius"], [175, "Mayotte"], [484, "Mexico"], [583, "Micronesia, Federated States Of"], [498, "Moldova, Republic Of"], [492, "Monaco"], [496, "Mongolia"], [500, "Montserrat"], [504, "Morocco"], [508, "Mozambique"], [104, "Myanmar"], [516, "Namibia"], [520, "Nauru"], [524, "Nepal"], [528, "Netherlands"], [530, "Netherlands Antilles"], [540, "New Caledonia"], [554, "New Zealand"], [558, "Nicaragua"], [562, "Niger"], [566, "Nigeria"], [570, "Niue"], [574, "Norfolk Island"], [580, "Northern Mariana Islands"], [578, "Norway"], [512, "Oman"], [586, "Pakistan"], [585, "Palau"], [275, "Palestine, State of"], [591, "Panama"], [598, "Papua New Guinea"], [600, "Paraguay"], [604, "Peru"], [608, "Philippines"], [612, "Pitcairn"], [616, "Poland"], [620, "Portugal"], [630, "Puerto Rico"], [634, "Qatar"], [638, "Réunion"], [642, "Romania"], [643, "Russian Federation"], [646, "Rwanda"], [654, "Saint Helena, Ascension and Tristan da Cunha"], [659, "Saint Kitts And Nevis"], [662, "Saint Lucia"], [666, "Saint Pierre And Miquelon"], [670, "Saint Vincent And The Grenadines"], [882, "Samoa"], [674, "San Marino"], [678, "Sao Tome And Principe"], [682, "Saudi Arabia"], [686, "Senegal"], [891, "Serbia And Montenegro"], [690, "Seychelles"], [694, "Sierra Leone"], [702, "Singapore"], [703, "Slovakia"], [705, "Slovenia"], [90, "Solomon Islands"], [706, "Somalia"], [710, "South Africa"], [239, "South Georgia And The South Sandwich Islands"], [724, "Spain"], [144, "Sri Lanka"], [729, "Sudan"], [740, "Suriname"], [744, "Svalbard And Jan Mayen"], [748, "Swaziland"], [752, "Sweden"], [756, "Switzerland"], [760, "Syrian Arab Republic"], [158, "Taiwan"], [762, "Tajikistan"], [834, "Tanzania, United Republic Of"], [764, "Thailand"], [626, "Timor-Leste"], [768, "Togo"], [772, "Tokelau"], [776, "Tonga"], [780, "Trinidad And Tobago"], [788, "Tunisia"], [792, "Turkey"], [795, "Turkmenistan"], [796, "Turks And Caicos Islands"], [798, "Tuvalu"], [800, "Uganda"], [804, "Ukraine"], [784, "United Arab Emirates"], [826, "United Kingdom"], [840, "United States"], [581, "United States Minor Outlying Islands"], [858, "Uruguay"], [860, "Uzbekistan"], [548, "Vanuatu"], [862, "Venezuela, Bolivarian Republic of"], [704, "Viet Nam"], [92, "Virgin Islands, British"], [850, "Virgin Islands, U.S."], [876, "Wallis And Futuna"], [732, "Western Sahara"], [887, "Yemen"], [894, "Zambia"], [716, "Zimbabwe"]];
// Array of all years in dataset
var years = [2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999,1998,1997,1996,1995,1994,1993];
// Array of data sets available to be mapped
var dataTypes = [["r", "Corporate Income Tax Rate"]];
// Set default country for charts
var defaultCountry = 826;
// Set default year for mapping
var defaultYear = 2014;
// Set default data type for mapping
var defaultDataType = "r";
// Set the fill color for map countries with no data
var defaultFill = "#ccc";

// Define projection and other map variables
var projection = d3.geo.naturalEarth()
    .scale(width/scalar)
    .translate([width/2,((height/2)-30)]);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

// Define the color scales
var interpolationMode = d3.interpolateHcl;
var color = {
  "r": d3.scale.linear()
  .domain([0,1])
  .range(["#fcee21", "#1b1464"])
  .interpolate(interpolationMode)
};

// Format numbers into dollars or percents
var dataFormat = {
  "dollar": d3.format("$,"),
  "percent": d3.format("%")
};

// Legend variables
var legendData = {
  "r": [{"color":defaultFill,"n":"No Data"},
        {"color": "#fcee21", "n": "0%"},
        {"color": "#ffc011", "n": "20%"},
        {"color": "#ff6e3e", "n": "40%"},
        {"color": "#da2a5d", "n": "60%"},
        {"color": "#1b1464", "n": "80%"},
        {"color": "#000033", "n": "100%+"}]
};

// Create tooltip
var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("opacity", 0);

// Create the selection menus to display data
// Country menu
var menu = d3.select("body").append("form");
var countryList = menu.append("label").text("Country ").append("select").attr("id", "countries").attr("onChange", "updateTaxData()").selectAll("option")
    .data(countries)
  .enter()
    .append("option")
    .attr("class", function(d){return "country" + d[0];})
    .attr("value", function(d){return d[0];})
    .attr("selected", function(d){if(d[0]==826){return "selected";}})
    .text(function(d){return d[1];});
d3.select("id","countries").append("br");
// Year Menu
var yearList = menu.append("label").text(" Year ").append("select").attr("id", "years").attr("onChange", "updateYearSelect()").selectAll("option")
    .data(years)
  .enter()
    .append("option")
    .attr("class", function(d){return "year" + d;})
    .attr("value", function(d){return d;})
    .text(function(d){return d;});
// Data Menu
// var dataList = menu.append("label").text(" Tax Data ").append("select").attr("id", "data-types").attr("onChange", "updateTaxData()").selectAll("option")
//     .data(dataTypes)
//   .enter()
//     .append("option")
//     .attr("value", function(d){return d[0];})
//     .text(function(d){return d[1];});

// Create map title
var mapH2 = d3.select("body").append("h2").attr("id", "map-title");

// Create the map SVG
var mapSvg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Define cross-hatch pattern
mapSvg.append("defs")
    .append("pattern")
      .attr("id", "diagonalHatch")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", 4)
      .attr("height", 4)
    .append("path")
      .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
      .attr("stroke", "#085197")
      .attr("stroke-width", 1.5);

// Add explanatory note to map
var mapNotes = d3.select("body").append("p").text("Note: ");
// Create chart title
var chartH2 = d3.select("body").append("h2").attr("id", "chart-title");

// Create the chart SVG
var chartSvg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", chartHeight);

var worldMap = mapSvg.append("g").attr("id", "map");

// Draw the initial map
drawWorld();

// Load and display the World
function drawWorld() {
  d3.json(topojson_url, function(error, world) {
    // Create SVG paths
    worldMap.selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
    .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", defaultFill)
      .attr("stroke", "#fff")
      .attr("stroke-width", "0.5px")
      .attr("cursor", "pointer")
      .attr("onmouseup", function(d){return "countrySelect(" + d.id + ")";})
      .attr("class", function(d){return "country country" + d.id;})
      .attr("value", function(d){return d.id;});

    // Add default colors
    displayTaxData(defaultCountry,defaultDataType,defaultYear);

    // Create stroke around map
    worldMap.append("path")
      .datum(graticule.outline)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", defaultFill)
      .attr("stroke-width", "2px");
  });
}

// Add map legend
var legendScale = d3.scale.ordinal();

var legend = mapSvg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(0," + (height - margin.bottom) + ")");

// Define chart scales
var x = d3.scale.ordinal()
  .rangeRoundBands([100,width-margin.right], 0.1);
var y = d3.scale.linear()
  .range([(chartHeight-margin.bottom - margin.top), 25]);

// Pull the tax data and use it
function displayTaxData(c,t,yr) {
  // Map title
  var dataName = "";
  for (var m in dataTypes) {
    if (t == dataTypes[m][0]) {dataName = dataTypes[m][1];}
  }
  var countryName = "";
  for (var n in countries) {
    if (c == countries[n][0]) {countryName = countries[n][1];}
  }
  var mapTitle = "Corporate Tax Rates in " + yr;

  mapH2.text(mapTitle);

  // Modify the legend
  var legendDomain = [];
  for (var item in legendData[t]) {
    legendDomain.push(legendData[t][item].n);
  }

  legendScale
    .rangeRoundBands([margin.left,width-margin.right], 0.1)
    .domain(legendDomain);

  var legendAxis = d3.svg.axis()
    .scale(legendScale)
    .orient("bottom");

  legend.call(legendAxis);

  legend.selectAll("rect")
    .data(legendData[t])
  .enter()
    .append("rect")
    .attr("x", function(d){return legendScale(d.n);})
    .attr("y", -30)
    .attr("height", 30)
    .attr("class", "legend-item")
    .transition()
    .duration(700)
    .attrTween("width", function(){return d3.interpolate(0,legendScale.rangeBand());})
    .attrTween("fill", function(d){return d3.interpolate("#fff",d.color);});

  d3.csv(data_url, function(error, taxes) {

    // Update map colors
    for (var tax in taxes) {
      var selectedCountry = worldMap.selectAll(".country" + tax);
      if (taxes[tax][t][yr]) {
        selectedCountry
        .transition()
        .duration(700)
        .attr("fill", color[t](taxes[tax][t][yr]));
      } else {
        selectedCountry.attr("fill", defaultFill);
      }
    }
    worldMap.select(".country840").attr("fill", "url(#diagonalHatch)");

    // parse data for chart display
    var allYears = d3.map(taxes[c][t]).keys();
    var allValues = d3.map(taxes[c][t]).values();
    var allDisplay = [];
    var barData = [];
    for (var l = 0; l < allYears.length; l++) {
      allYears[l] = parseInt(allYears[l]);
      if (allValues[l] && t == "r") {
        allValues[l] = parseFloat(allValues[l]);
        allDisplay[l] = dataFormat.percent(allValues[l]);
      } else if (allValues[l]) {
        allValues[l] = parseInt(allValues[l]);
        allDisplay[l] = dataFormat.dollar(allValues[l]*1000);
      } else {
        allValues[l] = 0;
        allDisplay[l] = 0;
      }
      barData[l] = {
        "year": allYears[l],
        "value": allValues[l],
        "display": allDisplay[l]
      };
    }
    smallestValue = 0;
    if (d3.min(allValues) < smallestValue) { smallestValue = d3.min(allValues); }

    // Set domain for scales
    x.domain(allYears);
    y.domain([smallestValue, d3.max(allValues)]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(axisFormat(t));

    // Create axes
    chartSvg.append("g")
    .attr("class", "x axis")
      .attr("transform", "translate(0," + (chartHeight - margin.bottom - margin.top) + ")")
      .call(xAxis);

    chartSvg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + 100 + ",0)")
      .call(yAxis);

    // Create bars
    var dataBars = chartSvg.selectAll(".bar")
        .data(barData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("value", function(d){return d.value;})
        .attr("x", function(d){return x(d.year);})
        .attr("y", function(d){return chartHeight-margin.bottom-margin.top;})
        .attr("width", x.rangeBand())
        .attr("height", 0)
        .attr("fill", function(d){return color[t](d.value);})
        .attr("cursor", "pointer");
    // Animate bars
    dataBars.transition()
        .duration(700)
        .attr("y", function(d){return y(Math.max(0, d.value));})
        .attr("height", function(d){return Math.abs(y(d.value) - y(0));});

    // Add tooltips
    dataBars
      .on("mouseover", function(d){
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(d.display)
          .style("left", x(d.year) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d){
        tooltip.transition()
          .duration(200)
          .style("opacity",0);
      })
      .attr("onmouseup", function(d){return "yearSelect(" + d.year + ")";});

    var chartTitle = "Foreign " + dataName + " for US Corporations in " + countryName + " from " + d3.min(allYears) + " to " + d3.max(allYears);

    chartH2.text(chartTitle);

    var yAxisLabel = "";
    if (t == "r") {
      yAxisLabel = "Tax Rate";
    } else {
      yAxisLabel = "Real 2010 US Dollars (Thousands)";
    }

    chartSvg.append("text")
      .attr("class", "label y-axis")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left)
      .attr("x", (margin.bottom + margin.top) - chartHeight)
      .text(yAxisLabel);

    chartSvg.append("text")
      .attr("class", "label x-axis")
      .attr("y", chartHeight)
      .attr("x", width/2 - margin.left)
      .text("Years");
  });
}

function updateData(c,t,yr) {
   // Map title
  var dataName = "";
  for (var m in dataTypes) {
    if (t == dataTypes[m][0]) {dataName = dataTypes[m][1];}
  }
  var countryName = "";
  for (var n in countries) {
    if (c == countries[n][1]) {countryName = countries[n][0];}
  }
  var forOrBy = "";
  if (t == "t") {forOrBy = "by";}
  else {forOrBy = "for";}
  var mapTitle = "Foreign " + dataName + " " + forOrBy + " US Corporations in " + yr;

  mapH2.text(mapTitle);

  // Modify the legend
  var legendDomain = [];
  for (var item in legendData[t]) {
    legendDomain.push(legendData[t][item].n);
  }

  legendScale
    .rangeRoundBands([margin.left,width-margin.right], 0.1)
    .domain(legendDomain);

  var legendAxis = d3.svg.axis()
    .scale(legendScale)
    .orient("bottom");

  legend.call(legendAxis);

  legend.selectAll(".legend-item")
    .remove();

  legend.selectAll(".legend-item")
    .data(legendData[t])
  .enter()
    .append("rect")
    .transition()
    .duration(700)
    .attr("x", function(d){return legendScale(d.n);})
    .attr("y", -30)
    .attrTween("width", function(){return d3.interpolate(0,legendScale.rangeBand());})
    .attr("height", 30)
    .attr("class", "legend-item")
    .attrTween("fill", function(d){return d3.interpolate("#fff",d.color);});

  d3.json(data_url, function(error, taxes) {
        // Update map colors
    for (var tax in taxes) {
      var selectedCountry = worldMap.selectAll(".country" + tax)
        .transition()
        .duration(700);
      if (taxes[tax][t][yr]) {
        selectedCountry.attr("fill", color[t](taxes[tax][t][yr]));
      } else {
        selectedCountry.attr("fill", defaultFill);
      }
    }
    worldMap.select(".country840").attr("fill", "url(#diagonalHatch)");

    // parse data for chart display
    var allYears = d3.map(taxes[c][t]).keys();
    var allValues = d3.map(taxes[c][t]).values();
    var allDisplay = [];
    var barData = [];
    for (var l = 0; l < allYears.length; l++) {
      allYears[l] = parseInt(allYears[l]);
      if (allValues[l] && t == "r") {
        allValues[l] = parseFloat(allValues[l]);
        allDisplay[l] = dataFormat.percent(allValues[l]);
      } else if (allValues[l]) {
        allValues[l] = parseInt(allValues[l]);
        allDisplay[l] = dataFormat.dollar(allValues[l]*1000);
      } else {
        allValues[l] = 0;
        allDisplay[l] = 0;
      }
      barData[l] = {
        "year": allYears[l],
        "value": allValues[l],
        "display": allDisplay[l]
      };
    }

    smallestValue = 0;
    if (d3.min(allValues) < smallestValue) { smallestValue = d3.min(allValues); }

    // Set domain for scales
    x.domain(allYears);
    y.domain([smallestValue, d3.max(allValues)]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(axisFormat(t));

    // Create axes
    chartSvg.append("g")
    .attr("class", "x axis")
      .attr("transform", "translate(0," + (chartHeight - margin.bottom - margin.top) + ")")
      .call(xAxis);

    chartSvg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + 100 + ",0)")
      .call(yAxis);

    // Create bars
    var dataBars = chartSvg.selectAll(".bar")
      .data(barData);
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
      .attr("fill", function(d){return color[t](d.value);});

    var chartTitle = "Foreign " + dataName + " " + forOrBy + " US Corporations in " + countryName + " from " + d3.min(allYears) + " to " + d3.max(allYears);

    chartH2.text(chartTitle);

    var yAxisLabel = "";
    if (t == "r") {
      yAxisLabel = "Tax Rate";
    } else {
      yAxisLabel = "Real 2010 US Dollars (Thousands)";
    }

    d3.selectAll(".y-axis").remove();

    chartSvg.append("text")
      .attr("class", "label y-axis")
      .attr("transform", "rotate(-90)")
      .attr("y", function(){if (t == "r") {return margin.left + 20;} else {return margin.left;}})
      .attr("x", function(){if (t == "r") {return -120;} else {return (margin.bottom + margin.top) - chartHeight;}})
      .text(yAxisLabel);
  });
}

function updateYear(c,t,yr) {
  // Map title
  var dataName = "";
  for (var m in dataTypes) {
    if (t == dataTypes[m][0]) {dataName = dataTypes[m][1];}
  }
  var countryName = "";
  for (var n in countries) {
    if (c == countries[n][1]) {countryName = countries[n][0];}
  }
  var forOrBy = "";
  if (t == "t") {forOrBy = "by";}
  else {forOrBy = "for";}
  var mapTitle = "Foreign " + dataName + " " + forOrBy + " US Corporations in " + yr;

  mapH2.text(mapTitle);

  d3.json(data_url, function(error, taxes) {
        // Update map colors
    for (var tax in taxes) {
      var selectedCountry = worldMap.selectAll(".country" + tax)
        .transition()
        .duration(700);
      if (taxes[tax][t][yr]) {
        selectedCountry.attr("fill", color[t](taxes[tax][t][yr]));
      } else {
        selectedCountry.attr("fill", defaultFill);
      }
    }
    worldMap.select(".country840").attr("fill", "url(#diagonalHatch)");
  });
}

// Update the map and charts
function updateTaxData() {
  var country = document.getElementById('countries').value;
  var dataType = document.getElementById('data-types').value;
  var year = document.getElementById('years').value;

  legend.selectAll(".tick").remove();
  chartSvg.selectAll(".axis").remove();
  updateData(country,dataType,year);
}

function countrySelect(id) {
  d3.select("#countries").select(".country" + id).attr("selected", "selected");
  updateTaxData();
}

function yearSelect(id) {
  d3.select("#years").select(".year" + id).attr("selected", "selected");

  var country = document.getElementById('countries').value;
  var dataType = document.getElementById('data-types').value;
  var year = document.getElementById('years').value;

  updateYear(country,dataType,year);
}

function updateYearSelect() {
  var country = document.getElementById('countries').value;
  var dataType = document.getElementById('data-types').value;
  var year = document.getElementById('years').value;

  updateYear(country,dataType,year);
}

function axisFormat(type) {
  if (type == "r") {
    return d3.format("%");
  } else {
    return d3.format("$,");
  }
}