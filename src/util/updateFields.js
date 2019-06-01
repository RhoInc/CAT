export default function updateFields(version) {
    this.controls.mainFunction.node().value = this.chartingApplication.main;
    this.controls.subFunction.node().value = this.chartingApplication.sub;
    this.controls.schema.node().value = this.chartingApplication.schema;
    this.controls.dataFileSelect
        .selectAll('option')
        .property('selected', d => this.chartingApplication.defaultData === d.label);
}
