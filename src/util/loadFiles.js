import scriptLoader from './scriptLoader';

export default function loadFiles(repo, pkg, branch, css) {
    const version = branch || pkg.version;
    const cdnURL = this.config.cdnURL + '/' + repo;

    //Load .css file
    if (css) {
        const cssURL = version === 'master'
            ? cdnURL + '/' + css
            : cdnURL + '@' + version + '/' + css;
        const link = document.createElement('link');
        link.href = cssURL;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    //Load .js file
    const jsURL = version === 'master'
        ? cdnURL + '/' + pkg.main.replace(/^\.?\/?/, '')
        : cdnURL + '@' + version + '/' + pkg.main.replace(/^\.?\/?/, '');

    const loader = new scriptLoader();
    const script = loader.require(jsURL, {
        async: true,
        success: () => {
            console.log(`Loaded ${jsURL}.`);
        },
        failure: () => {
            console.warn(`Failed to load ${jsURL}.`);
        }
    });
}
