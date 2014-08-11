//This file is not currently in use. It's unstable.

function InternationalMap(args) {
  this.titleText = args.titleText || "Untitled Map";
  this.dataPath = args.dataPath || "data.csv";
  this.topojsonPath = args.topojsonPath || "world.json";
  this.container = args.container || "body";
  this.margin = args.margin || {top: 20, left: 20, bottom: 20, right: 20};
  this.width = args.width || 600;
  this.height = args.height || 370;
  this.scalar = args.scalar || 5.75;
  this.defaultFill = args.defaultFill || "#ccc";
  this.lowColor = args.lowColor || "#fcee21";
  this.highColor = args.highColor || "#1b1464";
  this.defaultStroke = args.defaultStroke || "#fff";
  this.defaultStrokeWidth = args.defaultStrokeWidth || 0.5;
  this.steps = args.steps || 5;
  this.min = args.min || 0;
  this.max = args.max || 1;
  this.title = d3.select(this.container)
      .append("h2")
      .attr("id", "map-title");
  this.svg = d3.select(this.container).append("svg")
    .attr("width", this.width)
    .attr("height", this.height);
  this.worldMap = this.svg.append("g").attr("id", "map");
  this.legend = this.svg.append("g")
    .attr("id", "legend")
    .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")");
}

InternationalMap.prototype = {
  color: d3.scale.linear()
    .domain([this.min,this.max])
    .range([this.lowColor, this.highColor])
    .interpolate(d3.interpolateHcl),
  dataFormat: {
    "dollar": d3.format("$,"),
    "percent": d3.format("%")
  },
  tooltip: d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", 0),
  path: d3.geo.path()
    .projection(
      d3.geo.naturalEarth()
      .scale(this.width/this.scalar)
      .translate([this.width/2,((this.height/2)-30)])
    ),
  changeTitle: function(text, set) {
    this.titleText = text || this.titleText;
    var inSet = set ? " in " + set : "";
    return this.title
      .text(this.title + inSet);
  },
  addFill: function(data, item, set) {
    if (data[item] && data[item][set]) {
      return color(data[item][set]);
    } else {
      return defaultFill;
    }
  },
  addTooltip: function (data, item, set, labels) {
    var labelList = labels || false;
    var label;
    if (data[item] && data[item][set]) {
      if (labelList[item]) {
        label = labelList[item] + ": " + dataFormat.percent(data[item][set]);
      } else {
        label = dataFormat.percent(data[item][set]);
      }
    } else {
      label = "No Data";
    }
    this.tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    this.tooltip.html(label)
      .style("left", (d3.event.pageX - 50) + "px")
      .style("top", (d3.event.pageY - 25) + "px");
  },
  drawMap: function(world) {
    this.worldMap.selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
    .enter()
      .append("path")
      .attr("d", this.path)
      .attr("fill", this.defaultFill)
      .attr("stroke", this.defaultStroke)
      .attr("stroke-width", this.defaultStrokeWidth)
      .attr("cursor", "pointer")
      .attr("class", "country")
      .attr("id", function(d) { return "country" + d.id; })
      .on("mouseout", function(d) { this.tooltip.transition().duration(200).style("opacity",0);});

    // Create stroke around map
    this.worldMap.append("path")
      .datum(d3.geo.graticule().outline)
      .attr("d", this.path)
      .attr("fill", "none")
      .attr("stroke", this.defaultFill)
      .attr("stroke-width", "2px");
  },
  colorMap: function(data, set) {
    this.worldMap.selectAll(".country")
    .attr("fill", function(d) { return addFill(data, d.id, set); });
  },
};

var maps = new InternationalMap({
    dataPath: "data/international-corporate-tax-rate-2014.json",
    topojsonPath: "data/world-50m.json",
    titleText: "Global Corporate Tax Rates"
});
var year = 2014;