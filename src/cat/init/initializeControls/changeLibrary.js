export default function changeLibrary() {
    const cat = this;

    this.controls.rendererSelect.on('change', function(d) {
        cat.chartingApplication = d3.select(this).selectAll('option:checked').datum();
        cat.chartingApplication.version = 'master';
        cat.controls.versionSelect.selectAll('option').property('selected', d => d.label === cat.chartingApplication.version);
        cat.utilities.getVersions.call(cat, cat.chartingApplication.name)
            .then(versions => {
                cat.chartingApplication.versions = versions
                    .map(version => {
                        version.label = versions.tag_name
                            ? version.tag_name
                            : version.name;
                        return version;
                    });
                cat.utilities.updateSelect.call(cat, cat.controls.versionSelect, cat.chartingApplication.versions);
            });
        cat.utilities.loadPackageJSON.call(cat, cat.chartingApplication.name, 'master')
            .then(pkg => {
                cat.chartingApplication.pkg = JSON.parse(pkg);
                cat.utilities.loadFiles.call(cat, cat.chartingApplication.name, cat.chartingApplication.pkg, 'master', cat.chartingApplication.css);
                cat.utilities.updateFields.call(cat, cat.chartingApplication.main, cat.chartingApplication.sub, cat.chartingApplication.schema);
            });
    });
}
