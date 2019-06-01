export default function loadData() {
    this.utilities.updateSelect.call(this, this.controls.rendererSelect, this.config.renderers);
    this.utilities.updateSelect.call(this, this.controls.dataFileSelect, this.config.dataFiles);
}
