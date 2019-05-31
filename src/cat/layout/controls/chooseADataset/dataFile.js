export default function dataFile() {
    this.controls.dataFileSelect = this.controls.dataWrap.append('select');
    this.controls.dataFileSelect
        .selectAll('option')
        .data(this.config.dataFiles)
        .enter()
        .append('option')
        .text(d => d);
}
