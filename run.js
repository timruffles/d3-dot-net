var vizEl = document.getElementById("viz");
draw(vizEl,DATA);

function draw(el,data) {

  var layout = blockLayout()
    .group(function(value) {
      if(value < 1000) return 100;
      if(value < 1e6)  return 1000;
      if(value < 1e9)  return 1e6;
      if(value < 1e12) return 1e9;
      return 1e12;
    });

  var thousands = d3.format("0,000");
  var color = d3.scale.category20();

  var groups = d3.select(el)
    .selectAll(".group")
    .data(layout(data));

  // add the top level groups
  var groupsEntering = groups.enter()
    .append("div")
    .attr("class","group")

  groupsEntering
   .append("h2")
   .text(function(d) {
     return currency(parseInt(d.key));
   })

  var salaries = groups.selectAll(".salary")
    .data(function(x) { return x.values; });

  var salariesEntering = salaries.enter()
    .append("div")
    .attr("class","salary")

  salariesEntering.append("div")
    .attr("class","track");

  salariesEntering.append("h4")
    .text(salaryTitle);

  var units = salaries
    .select(".track")
    .attr("title",function(salary) {
      return currency(salary.value);
    })
    .selectAll(".unit")
    .data(createBlocks)
    .enter()
    .append("div")
    .attr("class","unit")
    .style("background",function(salary) {
      return color(salary.group.key);
    });

  function createBlocks(salary) {
     var blockCount = salary.units;
     var blocks = [];
     while(blockCount--) blocks.push(salary);
     return blocks;
  }

  function salaryTitle(d) {
    if(d.fromLast) return "Everyone from previous group's salaries";
    return d.title;
}

  function currency(x) {
    return "£" + thousands(x.toFixed(2));
  }
}

function blockLayout() {

  function layout(data) {

    data.sort(function(a,b) {
      return b.value - a.value;
    });

    var nested = d3.nest()
      .key(function(d) { return grouper(d.value) })
      .entries(data)
      .map(function(group) {
        group.values.forEach(function(v) {
          v.units = getUnits(v,group);
          v.group = group;
        });

        group.total = group.values.reduce(sumValues,0);

        return group;
      });

    // each group has access to previous group and we add an additional
    // value: the total of the previous group
    d3.pairs(nested).forEach(function(pair) {
      pair[0].less = pair[1];
      var comparison = {
        value: pair[1].total,
        group: pair[0],
        fromLast: true,
      };
      comparison.units = getUnits(comparison,pair[0]);
      pair[0].values.push(comparison);
    });

    return nested;
  }

  function grouper(v) {
    return Math.log(v);
  }

  layout.group = function(x) { grouper = x; return this; };

  return layout;

  function getUnits(value,group) {
    var unit = parseInt(group.key);
    return Math.ceil(value.value/unit);
  }

  function sumValues(a,s) {
    return a + s.value;
  }
}
