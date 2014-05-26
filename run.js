var layout = block();
var thousands = d3.format("0,000")
main();

function main() {
  draw(document.getElementById("viz"),DATA);
}

function draw(el,data) {
  data.sort(function(a,b) {
    return b.value - a.value;
  });

  var color = d3.scale.category20();

  var groups = layout(data);

  el = d3.select(el);

  var groups = el
    .selectAll(".group")
    .data(groups);

  // add the top level groups
  var groupsEntering = groups.enter()
    .append("div")
    .classed("group",true)

  groupsEntering
    .append("h2")
    .text(function(d) {
      return d.key
    });

  var salaries = groups.selectAll(".salary")
    .data(function(x) {
      var values = x.values;
      if(!x.less) return values;
      return values.concat({
        title: "All previous group's salaries",
        value: x.less.total,  
        group: x,
      })
    });

  var salariesEntering = salaries.enter()
    .append("div")
    .classed("salary",true)

  salaries
    .append("h4")
    .text(function(d) {
      return d.title
    });

  var unitsEntering = salariesEntering
    .append("div")
    .classed("track",true)
    .attr("title",function(salary) {
      return pounds(salary.value);
    })
    .selectAll(".unit")
    .data(function(salary) {
       var unit = salary.group.unit;
       return nMap(Math.ceil(salary.value/unit),function(_x,i) {
         return salary;
       });
    })
    .enter()
    .append("div")
    .classed("unit",true)
    .style("background",function(salary) {
      return color(salary.group.key);
    });
}

function nMap(n,fn) {
  var m = n;
  var times = [];
  while(n--) times.push(m - n);
  return times.map(fn);
}

function p(x) { return console.log(x) }

function pounds(x) {
  return "£" + thousands(x);
}
