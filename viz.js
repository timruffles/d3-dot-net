function block() {

  function layout(data) {
    var nested = d3.nest()
      .key(function(d) { return grouper(value(d)) })
      .entries(data)
      .map(function(group) {

        // if we have a value, we can access the group for comparison
        group.values.forEach(function(v) {
          v.group = group;
        });

        group.total = group.values.reduce(function(a,s) {
          return a + value(s);
        },0);

        return group;
      });

    // each group has access to previous group
    d3.pairs(nested).forEach(function(pair) {
      pair[0].less = pair[1];
    });

    return nested;
  }

  function value(d) { return d.value }
  function grouper(v) { return Math.log(v) }

  layout.value = function(x) { value = x; return this; };
  layout.group = function(x) { grouper = x; return this; };

  return layout;
}
