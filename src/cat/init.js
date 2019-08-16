import parseURL from './parseURL';
export function init() {
    //layout the cat
    this.wrap = d3
        .select(this.element)
        .append('div')
        .attr('class', 'cat-wrap');
    this.layout(this);

    //initialize the settings
    this.setDefaults(this);

    //create the controls
    this.controls.init(this);

    // parse queries
    parseURL.call(this);
}
