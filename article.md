D3 tips'n'tricks
================

D3 

Datavis is an art, requiring hard work and abandoned prototypes to come up with a design that tells the story of your data. Thankfully we have plagerism: we'll recreate XKCD's "Money" visualisation. We're going to take data on the income of people, firms and countries, and visualise them in broad groups of magnitude.

Our task can be nicely broken down into data and presentation.

D3 is a thin wrapper around the DOM: so your existing HTML, CSS, JS and SVG skills are all you'll need to figure this out. We have a hierarchy: top level groups of magnitude, then indivudal incomes, then the units of millions or billions. SVG is what you'll grab if you need the kind of bizarre shape that HTML doesn't suport, like the exotic 'circle', but for this we don't need such fanciness. Let's get started.

```javascript
function draw(el,data) {

  var groups = d3.select(el)
    .selectAll(".group")
    .data(layout(data));

  var groupsEntering = groups.enter()
    .append("div")
    .attr("class","group")

  var salaries = groups.selectAll(".salary")
    .data(function(x) { return x.values; });

  var salariesEntering = salaries.enter()
    .append("div")
    .attr("class","salary");

  salariesEntering.append("div")
    .attr("class","track");

  salariesEntering.append("h4")
    .text(salaryTitle);

  var units = salaries
    .select(".track")
    .data(createBlocks)
    .enter()
    .append("div")
    .attr("class","unit");
}
```





A very common source of ugly D3 code is not getting your data in the right shape before you start visualising it. This goes beyond fixing rubbish APIs: the logical structure of your visualisation should shape your data.

In our case we want to break the incomes down into groups, and then visualise them as blocks. We'll wrap up this process of data-processing in what D3 calls a 'layout'. Layouts sound visual, but actually are purely concerned with the data side of a given visualisation.



If you have used jQuery, you'll find D3 comfortingly familar. We work on selections of elements via a chaining API. Most methods in D3 will return the selection we called them on.

```javascript
d3.select(vizEl)
  .selectAll(".group")
  .property("draggable",true)
  .style("background","blue")
```

For instance the code above selected all elements classed `.group`, made them `draggable` and set their background colour to blue.

The difference is that where jQuery's API is structured around elements, D3's is structured around data. We link a selection of elements with a given data-set by calling `.data()` on the selection with an array of data.

To drive our document with our data we use callbacks. For instance:

```javascript
d3.select(vizEl)
  .selectAll(".group")
  .data([
    { title: "one", value: 10 },
    { title: "two", value: 20 },
  ])
  .style("width",function(data,index) {
    return data.value + "px";
  })
  .text(function(data,index) {
    return data.title;
  })
```

Here the elements will derive their `width` style attribute and text content from their corresponding data element.

We are using DOM elements to visualise our data, so we'll normally keep the number of elements in sync with the number of datums we have. To do this we use D3's three contexts: `enter()`, update, and `exit()`.


