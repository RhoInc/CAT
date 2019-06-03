export default function loadPackageJson() {
    return new Promise((resolve, reject) => {
        this.current.url =
            this.current.version === 'master'
                ? `${this.current.rootURL || this.config.rootURL}/${this.current.name}`
                : `${this.current.rootURL || this.config.rootURL}/${this.current.name}@${
                      this.current.version
                  }`;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${this.current.url}/package.json`);
        xhr.onload = function() {
            if (this.status === 200) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusTxt: xhr.statusText
                });
            }
        };
        xhr.onerror = function() {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}
