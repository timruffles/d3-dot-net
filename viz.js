function block() {

  var value = function(d) {
    return d.value;
  };

  var grouped = function(d) {
    d = value(d);
    if(d < 1000) return 100;
    if(d < 1e6) return 1000;
    if(d < 1e9) return 1e6;
    return 1e9;
  }

  function nest(data) {
    var nested = d3.nest()
      .key(grouped)
      .entries(data)
      .map(function(group) {
        group.unit = group.key;
        group.values.forEach(function(v) {
          v.group = group;
        });
        group.total = group.values.reduce(function(a,s) {
          return a + value(s);
        },0);
        return group;
      });

    d3.pairs(nested).forEach(function(pair) {
      pair[0].less = pair[1];
    });

    return nested;
  }

  function layout(data) {
    return nest(data);
  }

  return layout;
}
