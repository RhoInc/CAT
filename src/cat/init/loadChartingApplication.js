export default function loadChartingApplication() {
    this.chartingApplication = this.config.renderers[0];
    this.utilities.getVersions.call(this, this.chartingApplication.name)
        .then(versions => {
            this.chartingApplication.versions = versions
                .map(version => {
                    version.label = versions.tag_name
                        ? version.tag_name
                        : version.name;
                    return version;
                });
            this.utilities.updateSelect.call(this, this.controls.versionSelect, this.chartingApplication.versions);
        });
    this.utilities.loadPackageJSON.call(this, this.chartingApplication.name, 'master')
        .then(pkg => {
            this.chartingApplication.pkg = JSON.parse(pkg);
            this.utilities.loadFiles.call(this, this.chartingApplication.name, this.chartingApplication.pkg, 'master', this.chartingApplication.css);
            this.utilities.updateFields.call(this, this.chartingApplication.main, this.chartingApplication.sub, this.chartingApplication.schema);
        });
}
