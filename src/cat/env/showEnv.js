export function showEnv(cat) {
  console.log("showing the env");
  var current_css = [];
  d3.selectAll("link").each(function() {
    var obj = {};
    obj.link = d3.select(this).property("href");
    obj.active = d3.select(this).property("disabled");

    current_css.push(obj);
  });

  console.log(current_css);
  var cssItems = cat.controls.cssList.selectAll("li").data(current_css);

  cssItems.enter().append("li");

  cssItems.text(d => d.link);

  cssItems.exit().remove();
}
