
.unit {
  float: left;
  width: 10px; height: 10px;
  background: red; }
.track {
  overflow: auto;
  width: 200px; }





var color = d3.scale.category10();

// used to style our unit blocks
units.style("background",function(salary) {
  return color(salary.group.key);
});
