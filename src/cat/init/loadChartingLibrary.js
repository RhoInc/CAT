export default function loadChartingLibrary() {
    this.utilities.getVersions.call(this, this.config.chartingLibrary.name)
        .then(versions => {
            this.config.chartingLibrary.versions = versions
                .map(version => {
                    version.label = versions.tag_name
                        ? version.tag_name
                        : version.name;
                    return version;
                });
            this.utilities.updateSelect.call(this, this.controls.libraryVersion, this.config.chartingLibrary.versions);
        });
    this.utilities.loadPackageJSON.call(this, this.config.chartingLibrary.name, 'master')
        .then(pkg => {
            this.config.chartingLibrary.pkg = JSON.parse(pkg);
            this.utilities.loadFiles.call(this, this.config.chartingLibrary.name, this.config.chartingLibrary.pkg, 'master', this.config.chartingLibrary.css);
        });
}
