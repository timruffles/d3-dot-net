

function blockLayout() {

  var grouper = Math.log;
  layout.group = function(x) { grouper = x; return this; };
  return layout;

  function layout(data) {

    data.sort(function(a,b) { return b.value - a.value; });

    var nested = d3.nest()
      .key(function(d) { return grouper(d.value) })
      .entries(data)
      .map(function(group) {
        group.values.forEach(function(v) {
          v.units = getUnits(v.value,group);
        });
        group.total = group.values.reduce(sumValues,0);
        return group;
      });

    d3.pairs(nested).forEach(function(pair) {
      var group = pair[0], total = pair[1].total;
      group.values.push({
        value: total,
        group: group,
        fromLast: true,
        units: getUnits(total,group)
      });
    });

    return nested;
  }

  function getUnits(value,group) { 
    return Math.ceil(value/parseInt(group.key));
  }
  function sumValues(a,s) { return a + s.value; }
}
var layout = blockLayout()
  .group(function(value) {
    if(value < 1e6)  return 1000;
    if(value < 1e9)  return 1e6;
    if(value < 1e12) return 1e9;
    return 1e12;
  });

var salaryGroups = layout(listOfSalaries);
var groups = d3.select("#viz").selectAll(".group")
  .data(salaryGroups)

var groupsEntering = groups.enter()
  .append("div").attr("class","group")
var salaries = groups.selectAll(".salary")
  .data(function(x) { return x.values; });

var salariesEntering = salaries.enter()
  .append("div").attr("class","salary");
var units = salariesEntering
  .append("div").attr("class","track")
  .selectAll(".unit").data(createBlocks)
  .enter()
  .append("div").attr("class","unit")
function createBlocks(salary) {
   var blockCount = salary.units, blocks = [];
   while(blockCount--) blocks.push(salary);
   return blocks;
}
