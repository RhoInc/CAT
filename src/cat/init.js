import { addFind } from "../util/addFind";

export function init() {
  //find polyfill (for IE etc)
  addFind();

  //layout the cat
  this.wrap = d3
    .select(this.element)
    .append("div")
    .attr("class", "cat-wrap");
  this.layout(this);

  //initialize the settings
  this.setDefaults(this);

  //add others here!

  //create the controls
  this.controls.init(this);
}
