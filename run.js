var layout = block()
  .group(function(value) {
    if(value < 1000) return 100;
    if(value < 1e6) return 1000;
    if(value < 1e9) return 1e6;
    return 1e9;
  });

var thousands = d3.format("0,000");

main();

function main() {
  var compareEl = document.getElementById("compare");
  var compareFn = comparison(compareEl);

  var vizEl = document.getElementById("viz");

  addSalaryForm(document.getElementById("add-salary"),function(salary) {
    DATA.push(salary);
    draw(vizEl,DATA); 
  });

  draw(vizEl,DATA,compareFn);
}

function draw(el,data,compare) {
  data.sort(function(a,b) {
    return b.value - a.value;
  });

  var color = d3.scale.category20();

  var groups = layout(data)


  el = d3.select(el);

  var groups = el
    .selectAll(".group")
    .data(groups);

  groups.exit().remove();

  // add the top level groups
  var groupsEntering = groups.enter()
    .append("div")
    .classed("group",true)

  groupsEntering
   .append("h2")
   .text(pipe(get("key"),parseInt,currency));

  var salaries = groups.selectAll(".salary")
    .data(function(x) {
      var values = x.values;
      if(!x.less) return values;
      return values.concat({
        title: "Everyone from previous group's salaries",
        value: x.less.total,  
        group: x,
      })
    });

  var salariesEntering = salaries.enter()
    .append("div")
    .classed("salary",true)
    .on("click",compare);

  salariesEntering
    .append("div")
    .classed("track",true);

  salariesEntering
    .append("h4");

  salaries
    .select("h4")
    .text(get("title"))

  salaries.exit().remove();

  var units = salaries
    .select(".track")
    .attr("title",function(salary) {
      return currency(salary.value);
    })
    .selectAll(".unit")
    .data(function(salary) {
       var unit = salary.group.key;
       var blockCount = Math.ceil(salary.value/unit);
       return repeatMap(blockCount,constantly(salary));
    })

  units
    .enter()
    .append("div")
    .classed("unit",true)

  units
    .style("background",function(salary) {
      return color(salary.group.key);
    });

  units.exit().remove();
}

function comparison(el) {

  var LIFETIME_IN_YEARS = 45;

  el = d3.select(el);

  var items = el.selectAll(".compared");

  var compare = [];
  var added = [];

  function picked(salary) {
    added.unshift(salary);
    compare = added.slice(0,2);
    compare.sort(function(a,b) {
      return a.value - b.value;
    })

    var compared = items.data(compare);

    compared
      .select("h3")
      .text(get("title"));

    compared
      .select(".amount")
      .text(pipe(get("value"),currency))

    if(compare.length < 2) return;

    var lower = compare[0];
    var higher = compare[1];

    var multiple = higher.value / lower.value;
    var multipleSet = [1,Math.sqrt(multiple)];

    // TODO make selection of wording based on difference, e.g
    // if similar, don't do the 'lifetime earnings' thing
    el.select(".higher .mult")
      .text(function() {
        var lifetimes = higher.value / (lower.value * LIFETIME_IN_YEARS);
        return thousands(lifetimes.toFixed(1));
      })

    el.select(".lower .mult")
      .text(function() {
        return thousands(multiple.toFixed(0));
      })

    el.selectAll(".multiple-visual .item")
      .data(multipleSet)
      .style("width",scaledPx)
      .style("height",scaledPx);

    el.selectAll(".wage")
      .data(compare)
      .text(pipe(get("value"),ukHourly,currency));

    function scaledPx(x) {
      return x * 5 + "px";
    }
  };

  return picked;
}

function ukHourly(a) {
  return hourly(a,220,8);
}
function hourly(annual,daysWorked,hoursWorked) {
  return annual / (daysWorked * hoursWorked);
}

function addSalaryForm(el,cb) {
  el = d3.select(el)
  el.on("submit",function() {
    d3.event.preventDefault();
    var form = d3.select(this);
    var name = form.select("[name=name]");
    var salary = form.select("[name=salary]");
    cb({
      title: name.property("value"),
      value: parseInt(salary.property("value")),
    });
    name.property("value","");
    salary.property("value","");
  });
}

function currency(x) {
  return "£" + thousands(x.toFixed(2));
}
function identity(x) {
  return x;
}
function constantly(x) {
  return function() {
    return x;
  }
}
function pxer(fn) {
  return function() {
    return fn.apply(null,arguments) + "px"
  }
}

function get(p) {
  return function(o) {
    return o[p];
  }
}

function repeatMap(n,fn) {
  var times = [];
  while(n--) times.push(fn());
  return times;
}

function p(x) { return console.log(x) }


// compose functions left to right,
// more readable than 'compose'
//   => pipe(parseInt,Math.sqrt)("64.928")
//   8
function pipe() {
  var fns = arguments;
  return function() {
    var value = arguments;
    for(var i = 0; i < fns.length; i++) {
      value = [fns[i].apply(null,value)];
    }
    return value[0];
  }
}
