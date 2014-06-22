# Wrangle and present data with D3

D3 is a toolkit for building visualisations from scratch. It's a thin wrapper around the DOM, so with HTML, CSS and JavaScript you’re already halfway there. It's tremendously powerful, and tremendous fun. Never again will you disappoint your designer by stuffing their expertly tuned Dribbble-fodder into a boring chart.

D3 is best learned by example, so we'll recreate XKCD's "Money" visualisation. We'll take income data on people, firms and countries and visualise them grouped roughly by powers of one thousand.

![Incomes grouped by magnitude. This is the inspiration for the visualisation we're creating.](../img/target.png)

Our task is split between data and presentation. If you try to visualise your data before you've wrangled it into the right shape you'll end up with a mess.

We'll wrap up the data part in what D3 calls a 'layout'. Layouts sound visual, but are actually the data-wrangling side of a given visualisation. They're standard JavaScript functions called with input data and returning new data formatted for display. A histogram layout might be passed an array of 1,500 objects, and return an array of 10 arrays, each bucketing 150 objects. Displaying its output is entirely up to you - you might not even use D3. This splits the reusable data-processing algorithm from a specific presentation.

We need to break the incomes down into magnitude groups, and then visualise them as blocks. Our income data is in the format `{ value: 2500000, title: "Jimmy Carr" }`, our target format is below. It reflects the visualisation: the previous group is included in the next for comparison, and we've calculated the number of unit blocks to display:

```javascript
[
  {
    key: "1000000",
    total: 2124000000000,
    values: [
      { title: "Jimmy Carr",
        value: 2500000,
        units: 25 }, /* ... more salaries */
      { fromLast: true,
        value:  105000,
        units: 1 }, /* total of previous group */
    ]
  },  /* ... more groups of salaries */
];
```

Let's implement! Our data is hierarchical so `d3.nest()` is the right tool: it takes an array and groups it by a key function.


[//]: # article-code.js:2
```javascript
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
```

As layouts are just JavaScript functions, and functions are objects, we expose our configuration function as the layout's `group` property. To configure our layout we call `.group(keyFunction)` on the layout in a chaining style. To use it, we call it on our original dataset to create `salaryGroups` ready for binding.

[//]: # article-code.js:3
```javascript
var layout = blockLayout()
  .group(function(value) {
    if(value < 1e6)  return 1000;
    if(value < 1e9)  return 1e6;
    if(value < 1e12) return 1e9;
    return 1e12;
  });

var salaryGroups = layout(listOfSalaries);
```

At this point we've not displayed anything on screen. This division of labour allows our layout to be reused with different data sets, key functions and final visualisations.

Now we've cleaned up our data we can visualise. Here's a sketch of the HTML/CSS implementation:

![A sketch of the HTML/CSS implementation of the visualisation](../img/sketch.jpg)

We append the top level groups to represent the `salaryGroups` from our layout:

[//]: # article-code.js:4
```javascript
var groups = d3.select("#viz").selectAll(".group")
  .data(salaryGroups)

var groupsEntering = groups.enter()
  .append("div").attr("class","group")
```

Next we present the individual salaries. Our data is nested: we've appended elements for the top level group data which has the shape `{ key: "1000", values: [/* salaries */] }`. We therefore make a selection of `.salary` elements inside each group, and pass a function pulling out `.values` to `data()` to dig down the hierarchy for the salaries:

[//]: # article-code.js:5
```javascript
var salaries = groups.selectAll(".salary")
  .data(function(x) { return x.values; });

var salariesEntering = salaries.enter()
  .append("div").attr("class","salary");
```

Finally our units: we create track elements per salary, then use our nested `data()` trick again to make many units from each salary.

[//]: # article-code.js:6
```javascript
var units = salariesEntering
  .append("div").attr("class","track")
  .selectAll(".unit").data(createBlocks)
  .enter()
  .append("div").attr("class","unit")
```

`createBlocks()` is simple: if a salary needs 10 unit blocks, return an array of length 10:

[//]: # article-code.js:7
```javascript
function createBlocks(salary) {
   var blockCount = salary.units, blocks = [];
   while(blockCount--) blocks.push(salary);
   return blocks;
}
```

It's easier to define all static styling via CSS. We want the units to flow inside a constrained track. The rest of the styling I'll leave to you.

[//]: # article-css.css:1
```css
.unit {
  float: left;
  width: 10px; height: 10px;
  background: red; }
.track {
  overflow: auto;
  width: 200px; }
```

![The visualisation's output with basic styling.](../img/basic-styled.png)

With a little more styling and titles added we're done. Now get out there and visualise!

![The complete visualisation. It's testament to D3's design that it comes in at under 150 lines of JS, HTML and CSS.](../img/complete.png)

__BOX__

## D3 in a nutshell

If you have used jQuery, D3 is comfortingly familiar. We work on selections of elements via a chaining API.

```javascript
d3.select(vizEl).selectAll(".group")
  .property("draggable",true)
  .style("background","blue")
```

This code selects all `group` elements within `vizEl`, makes them `draggable` and set their background colour to blue.

But where jQuery's API loves the DOM, D3's loves data. We call `.data()` on a selection to provide it with a data set. Callbacks passed to selection methods are called for every element with its corresponding datum, and the datum's position in the data set:

```javascript
d3.select(vizEl).selectAll(".group")
  .data([
    { title: "one", value: 10 },
    { title: "two", value: 20 }
  ])
  .style("background","blue")
  .style("width",function(data,index) {
    return data.value + "px";
  })
  .text(function(data,index) {
    return data.title;
  })
```

![It's not much, but it's the first step to D3](../img/tiny-demo.png)

Here the `width` and text content of each element is derived from its corresponding datum.

We'll normally want to keep the number of elements in sync with the number of datums. D3's three contexts - `enter()`, update, and `exit()` - allow us to control this process. `enter()` paired with `append()` adds elements for datums without one, update handles cases where we have an element datum pair, and `exit()` affects elements left alone after we've paired the data.


__BOX__

## Scales

Dataviz coding will always involve transforming values in our data into attributes for display. D3's scales make this quicker and cleaner.

Scales return a function that transforms values from our data - the *domain* - into values for our visualisation - the *range*. The simplest to understand is `d3.linear()`, which is a line on the XY axis.

![Scales take values from our input domain and transform them into values in our output range for presentation](../img/scale-sketch.jpg)

Linear scales are useful, but there are many other types. If you have data with a huge range you can use `d3.scale.log()` to crunch down the variance into something graphable - the same technique used in the richter scale. `d3.scale.ordinal()` breaks data into categories.

Scales are packed with tools. If you want to draw an axis with 10 evenly spaced marks, call `ticks(10)` and you'll receive an array of 10 values along your range. To handle input above or below the intended domain, `clamp()` the scale.

One final powerful feature of scales is interpolation. Frequently we'll be transforming a number into a visual unit, like `px` or colours. To output pixels, we simply set the range to `["10px","1000px"]` and it'll output pixel values ready to use in `style()` callbacks. It can even handle colour transitions between RGB, HSL or named CSS colours.

As a demonstration, here's a colour wheel using two scales sharing the same domain: a hue scale and an angle scale:

![Making a colour wheel with a d3 scale](../img/color-wheel.png)

You can see it live at truffles.me.uk/dotnet-d3/colour-wheel, and the code is at truffles.me.uk/dotnet-d3/colour-wheel-code.

__BIG_QUOTE

Getting your data into the right shape is half the challenge

__BIG_QUOTE

D3 & SVG lets you break out from the boxy world of HTML/CSS

__END__
Box 1: quick intro to d3
Box 3: scales?

Image 1: XKCD original (or sketch version)
Image 2: sketch
Image 3: styled
Image 4: colorful + finished
Image 4: another viz with same layout? e.g sizes?

TODOs: host images
