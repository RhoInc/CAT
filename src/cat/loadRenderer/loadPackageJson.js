export default function loadPackageJson(cat) {
    return new Promise(function(resolve, reject) {
        cat.current.url =
            cat.current.version === 'master'
                ? `${cat.current.rootURL || cat.config.rootURL}/${cat.current.name}@latest`
                : `${cat.current.rootURL || cat.config.rootURL}/${cat.current.name}@${
                      cat.current.version
                  }`;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${cat.current.url}/package.json`);
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
