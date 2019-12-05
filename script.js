var uwmap = L.map('mapid').setView([47.657496, -122.307542], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibmNoYW43IiwiYSI6ImNqeGMxbXh3YTAwN3Ezb3A5Z2NiZ3d0bjYifQ.xBExfV164J2TU9NPnYXO2g'
}).addTo(uwmap);

L.svg().addTo(uwmap);

var svg = d3.select("#mapid")
  .append("svg")



dormData = [
  {name: 'Alder', students: 633, lat: 47.65568, lng: -122.313596}, 
  {name: 'Cedar', students: 338, lat: 47.657002, lng: -122.316176},
  {name: 'Elm', students: 530, lat: 47.656589, lng: -122.315080},
  {name: 'Haggett', students: 577, lat: 47.659214, lng: -122.303656}, 
  {name: 'Hansee', students: 320, lat: 47.660779, lng: -122.306538},
  {name: 'Lander', students: 667, lat: 47.65568,  lng:-122.3148673},
  {name: 'Madrona', students: 523, lat: 47.660079, lng: -122.305092},
  {name: 'Maple', students: 867, lat: 47.655725, lng: -122.316132},
  {name: 'McCarty', students: 918, lat: 47.660621, lng: -122.305003},
  {name: 'McMahon', students: 1020, lat: 47.658039, lng: -122.303641},
  {name: 'Mercer_AC', students: 627, lat: 47.654412, lng: -122.317786},
  // {name: 'Nordheim', students: 451, lat: 47.665235, lng: -122.300064},
  {name: 'Poplar', students: 266, lat: 47.656538, lng: -122.314049},
  {name: 'Stevens', students: 507, lat: 47.654262, lng: -122.316135}, 
  {name: 'Terry', students: 268, lat: 47.655662, lng: -122.316974},
  {name: 'Willow', students: 539, lat: 47.659557, lng: -122.304436}
]

// west - 4703
// north - 3897
// total - 9051

// var dormGroup = L.layerGroup();
//     dormData.forEach(function(d){
      
//         // binding data to marker object's option
//         L.marker(d.latlng, { achieve: d.achieve })
//             .on("mouseover", onMouseOver)
//             .on("mouseout", onMouseOut)
//             .addTo(pointsGroup);
//     });

var size = d3.scaleSqrt()
  .domain([200, 1100])  // What's in the data, let's say it is percentage
  .range([4, 22])

// var size = d3.scaleLinear()
//       .domain([200, 1100])  // What's in the data
//       .range([4, 22])  // Size in pixel

var Tooltip = d3.select("#mapid")
  .select("svg")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    // .style("z-index", "999");

var mouseover = function(d) {
  Tooltip.style("opacity", 1)
}
var mousemove = function(d) {
  Tooltip
    .html(d.name + "<br>" + "Students: " + d.students)
    .style("left", (d3.mouse(this)[0]+10) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
  Tooltip.style("opacity", 0)
}

d3.select("#mapid")
  .select("svg")
    .selectAll("myCircles")
    .data(dormData)
    .enter()
    .append("circle")
      .attr("cx", function(d){ return uwmap.latLngToLayerPoint([d.lat, d.lng]).x })
      .attr("cy", function(d){ return uwmap.latLngToLayerPoint([d.lat, d.lng]).y })
      .attr("r", function(d){ return size(d.students) })
      .attr("class", "circle")
      .style("fill", "purple")
      .attr("stroke", "purple")
      .attr("stroke-width", 2)
      .attr("fill-opacity", .3)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)


// Update function will keep circle position the same if the map changes
// Source: d3-graph-gallery
function update() {
  d3.select("#mapid")
    .select("svg")
      .selectAll("circle")
        .attr("cx", function(d){ return uwmap.latLngToLayerPoint([d.lat, d.lng]).x })
        .attr("cy", function(d){ return uwmap.latLngToLayerPoint([d.lat, d.lng]).y })
}

// If the user change the map (zoom or drag), circle position updated:
uwmap.on("moveend", update)




// BarChart

dormData.sort(function(b, a) {
  return a.students - b.students;
});


var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svgBar = d3.select("#barchart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(dormData.map(function(d) { return d.name; }))
  .padding(0.2);
  svgBar.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

var y = d3.scaleLinear()
  .domain([0, d3.max(dormData, function (d) {
    return Number(d.students);
    })])
  .range([height, 0]);
  svgBar.append("g")
  .call(d3.axisLeft(y));


  d3.select("#mapid")
  .select("svg")
  svgBar.selectAll("mybar")
  .data(dormData)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.name); })
    .attr("y", function(d) { return y(d.students); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.students); })
    .attr("fill", "#69b3a2")











// var Alder = L.circle([47.65568, -122.313596], {
//   color: 'purple',
//   fillColor: '#333',
//   fillOpacity: 0.5,
//   radius: 30    
// }).addTo(uwmap)

// var Lander = L.circle([47.65568, -122.3148673], {
//   color: 'purple',
//   fillColor: '#333',
//   fillOpacity: 0.5,
//   radius: 40    
// }).addTo(uwmap)


// Alder.bindPopup("Alder Hall, 633");
// Lander.bindPopup("Lander Hall, 667");



