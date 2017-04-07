import { loadRenderer } from '../loadRenderer'
import { renderChart } from '../renderChart'

export function init(cat){
  var settings = cat.config

  //submit
  cat.controls.submitButton = cat.controls.wrap.append("button").attr("class","submit").text("Render Chart")

  //Choose a renderer
  var rendererWrap = cat.controls.wrap.append("div").attr("class","control-wrap")
  rendererWrap.append("span").text("Renderer:")
  cat.controls.rendererSelect = rendererWrap.append("select")
  cat.controls.rendererSelect.selectAll("option")
  .data(settings.renderers)
  .enter()
  .append("option")
  .text(function(d){return d.name})

  //Choose a version
  rendererWrap.append("span").text("  Version:")
  cat.controls.versionSelect = rendererWrap.append("input")
  cat.controls.versionSelect.node().value="master"

  //Choose a data file
  var datafileWrap = cat.controls.wrap.append("div").attr("class","control-wrap")

  datafileWrap.append("span").text("Data:")
  cat.controls.dataFileSelect = datafileWrap.append("select")
  cat.controls.dataFileSelect.selectAll("option")
  .data(settings.dataFiles)
  .enter()
  .append("option")
  .text(function(d){return d})


  //Edit the settings
  var settingsWrap = cat.controls.wrap.append("div").attr("class","control-wrap")
  settingsWrap.append("span").text("Settings:")
  settingsWrap.append("br")
  cat.controls.settingsInput = settingsWrap.append("textarea")
  .attr("rows",10)
  .attr("cols",50)
  .text("{}")

  cat.controls.submitButton.on("click",function(){
    var rendererObj = cat.controls.rendererSelect.selectAll("option:checked").data()[0];
    var version = cat.controls.versionSelect.node().value;
    var rendererPath = cat.config.rootURL+"/"+rendererObj.name+"/"+version+"/build/"+rendererObj.main+".js";

    console.clear();
    console.log('Renderer: ' + rendererObj.name);
    console.log('  Version: ' + version);
    console.log('  URL: ' + rendererPath);

    loadRenderer(rendererPath, renderChart, cat)

  })
}
