function block() {

  var scale = d3.scale.quantile()
    .range([1,2,3,4,5,6]);

  var value = function(d) {
    return d.value;
  };
  var logValue = function(d) {
    return toLog10(value(d));
  }
  var log10 = Math.log(10);
  var toLog10 = function(x) {
    return Math.log(x) / log10;
  }

  function nest(data) {
    var domain = d3.extent(data,logValue);
    scale = scale.domain(domain);
    var nested = d3.nest()
      .key(function(d) {
        return scale(logValue(d));
      })
      .entries(data)
      .map(function(group) {
        var lowest = d3.min(group.values,value);
        group.unit = lowest / 3;
        group.values.forEach(function(v) {
          v.group = group;
        });
        group.total = group.values.reduce(function(a,s) {
          return a + s.value;
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
