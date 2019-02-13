export default function updateRenderer(select) {
    this.current = d3
        .select(select)
        .select('option:checked')
        .data()[0];
    this.current.version = 'master';

    //update the chart type configuration to the defaults for the selected renderer
    this.controls.mainFunction.node().value = this.current.main;
    this.controls.versionSelect.node().value = 'master';
    this.controls.subFunction.node().value = this.current.sub;
    this.controls.schema.node().value = this.current.schema;

    //update the selected data set to the default for the new rendererSection
    this.controls.dataFileSelect
        .selectAll('option')
        .property('selected', d => this.current.defaultData === d.label);

    //Re-initialize the chart config section
    this.settings.set(this);
}
