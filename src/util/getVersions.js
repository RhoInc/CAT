export default function getVersions(repo) {
    const apiURL = this.config.apiURL + '/' + repo;
    const branches = fetch(`${apiURL}/branches`).then(response => response.json());
    const releases = fetch(`${apiURL}/releases`).then(response => response.json());

    return Promise.all([branches, releases])
        .then(values => {
            const [branches, releases] = values;
            branches.sort(
                (a, b) =>
                    a.name === 'master' ? -1 : b.name === 'master' ? 1 : a.name < b.name ? -1 : 1
            );
            return d3.merge(values);
        })
        .catch(err => {
            console.log(err);
        });
}
