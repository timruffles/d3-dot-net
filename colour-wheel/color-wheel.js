main(document.querySelector("svg"),60);

function main(el,arcs) {

  var svg = d3.select(el);

  var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(300);

  var hueScale = d3.scale.linear()
    .domain([0,arcs-1])
    .range([0,360])

  var angleScale = hueScale.copy()
    .range([0,Math.PI * 2])

  for(var i = 0; i < arcs; i++) {
    drawArc(i);
  }

  function drawArc(i) {
    var color = d3.hsl(hueScale(i),1,0.6);
    svg.append("path")
      .attr("d",
        arc.startAngle(angleScale(i)).endAngle(angleScale(i+1))
      )
      .attr("transform","translate(301,301)")
      .attr("fill",color)
      .attr("stroke",color)
      .on("mouseover",function() {
        var lighter = color.brighter(0.4);
        d3.select(this).attr("fill",lighter).attr("stroke",lighter);
      })
      .on("mouseout",function() {
        d3.select(this).attr("fill",color).attr("stroke",color);
      })
  }
}
