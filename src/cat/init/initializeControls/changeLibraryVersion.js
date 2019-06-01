export default function changeLibraryVersion() {
    const cat = this;

    this.controls.versionSelect.on('change', function(d) {
        cat.chartingApplication.version = d3.select(this).selectAll('option:checked').datum().label;
        cat.utilities.loadPackageJSON.call(cat, cat.chartingApplication.name, cat.chartingApplication.version)
            .then(pkg => {
                cat.chartingApplication.pkg = JSON.parse(pkg);
                cat.utilities.loadFiles.call(cat, cat.chartingApplication.name, cat.chartingApplication.pkg, cat.chartingApplication.version, cat.chartingApplication.css);
                cat.utilities.updateFields.call(cat, cat.chartingApplication.main, cat.chartingApplication.sub, cat.chartingApplication.schema);
            });
    });
}
