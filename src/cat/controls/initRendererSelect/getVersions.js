export default function getVersions(select, repo = 'https://www.github.com/RhoInc/Webcharts') {
    console.log(this);
    console.log(select);
    console.log(repo);
    const api = repo.replace('www.github.com', 'api.github.com/repos');
    const branches = fetch(`${api}/branches`).then(response => response.json());
    const releases = fetch(`${api}/releases`).then(response => response.json());

    Promise
        .all([
            branches,
            releases
        ])
        .then(values => {
            select
                .selectAll('option')
                    .data(d3.merge(values))
                    .enter()
                .append('option')
                .text(d => d.name);
        });
}
