export function showEnv(cat) {
  /*build list of loaded CSS */
  var current_css = [];
  d3.selectAll("link").each(function() {
    var obj = {};
    obj.link = d3.select(this).property("href");
    obj.disabled = d3.select(this).property("disabled");
    obj.filename = obj.link.substring(obj.link.lastIndexOf("/") + 1);
    obj.wrap = d3.select(this);
    current_css.push(obj);
  });

  var cssItems = cat.controls.cssList.selectAll("li").data(current_css);

  var newItems = cssItems.enter().append("li");

  var itemContents = newItems.append("span").property("title", d => d.link);

  itemContents
    .append("a")
    .text(d => d.filename)
    .attr("href", d => d.link)
    .property("target", "_blank");

  var switchWrap = itemContents
    .append("label")
    .attr("class", "switch")
    .classed("hidden", d => d.filename == "cat.css");

  var switchCheck = switchWrap
    .append("input")
    .property("type", "checkbox")
    .property("checked", d => !d.disabled);
  switchWrap.append("span").attr("class", "slider round");

  switchCheck.on("click", function(d) {
    //load or unload css
    d.disabled = !d.disabled;
    d.wrap.property("disabled", d.disabled);

    //update toggle mark
    this.checked = !d.disabled;
  });

  cssItems.exit().remove();

  /*build list of loaded JS */
  var current_js = [];
  d3.selectAll("script").each(function() {
    var obj = {};
    obj.link = d3.select(this).property("src");
    obj.filename = obj.link.substring(obj.link.lastIndexOf("/") + 1);
    if (obj.link) {
      current_js.push(obj);
    }
  });

  var jsItems = cat.controls.jsList.selectAll("li").data(current_js);

  jsItems
    .enter()
    .append("li")
    .append("a")
    .text(d => d.filename)
    .property("title", d => d.link)
    .attr("href", d => d.link)
    .property("target", "_blank");

  jsItems.exit().remove();
}
