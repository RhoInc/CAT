import scriptLoader from '../../util/scriptLoader';

export default function loadRenderer(version, response) {
    this.current.package = JSON.parse(response);
    this.current.js_url = `${this.current.url}/${this.current.package.main.replace(
        /^\.?\/?/,
        ''
    )}`;
    this.current.css_url = this.current.css ? `${this.current.url}/${this.current.css}` : null;

    if (this.current.css) {
        this.current.link = document.createElement('link');
        this.current.link.href = this.current.css_url;

        this.current.link.type = 'text/css';
        this.current.link.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild(this.current.link);
    }

    const loader = new scriptLoader();
    this.current.script = loader.require(this.current.js_url, {
        async: true,
        success: () => {
            //this.status.loadStatus(
            //    this.statusDiv,
            //    true,
            //    this.current.js_url,
            //    this.current.name,
            //    version || this.current.version
            //);
        },
        failure: () => {
            //this.status.loadStatus(
            //    this.statusDiv,
            //    false,
            //    this.current.js_url,
            //    this.current.name,
            //    version || this.current.version
            //);
        }
    });
}
