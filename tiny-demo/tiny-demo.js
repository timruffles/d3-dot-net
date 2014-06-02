var vizEl = document.querySelector("#viz");
d3.select(vizEl).selectAll(".group")
  .data([
    { title: "one", value: 100 },
    { title: "two", value: 200 }
  ])
  .style("background","blue")
  .style("width",function(data,index) {
    return data.value + "px";
  })
  .text(function(data,index) {
    return data.title;
  })
