export default function loadPackageJSON(repo, version) {
    const cdnURL = this.config.cdnURL + '/' + repo;
    const pkgURL = version === 'master'
        ? cdnURL + '/package.json'
        : cdnURL + '@' + version + '/package.json';

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', pkgURL);
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
