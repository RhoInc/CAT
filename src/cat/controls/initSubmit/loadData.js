export default function loadData() {
    const dataFile = this.controls.dataFileSelect.node().value;
    this.dataObject = this.config.dataFiles.find(f => f.label == dataFile);
    this.dataObject.dataFilePath = this.dataObject.path + dataFile;
    return fetch(this.dataObject.dataFilePath)
        .then(response => response.text())
        .then(text => d3.csv.parse(text));
}
