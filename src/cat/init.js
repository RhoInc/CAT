export function init() {
    //layout the cat
    this.wrap = d3
        .select(this.element)
        .append('div')
        .attr('class', 'cat-wrap');

    this.layout.call(this); // layout the UI
    this.setDefaults.call(this); // initialize the settings
    this.controls.init.call(this); // create the controls
}
