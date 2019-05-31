export default function getVersions(
    select,
    repo = 'https://api.github.com/repos/RhoInc/Webcharts'
) {
    const branches = fetch(`${repo}/branches`).then(response => response.json());
    const releases = fetch(`${repo}/releases`).then(response => response.json());

    Promise.all([branches, releases])
        .then(values => {
            const [branches, releases] = values;
            branches.sort(
                (a, b) =>
                    a.name === 'master' ? -1 : b.name === 'master' ? 1 : a.name < b.name ? -1 : 1
            );
            select.selectAll('option').remove();
            select
                .selectAll('option')
                .data(d3.merge(values))
                .enter()
                .append('option')
                .text(d => d.tag_name || d.name)
                .property('selected', d => d.name === 'master');
        })
        .catch(err => {
            console.log(err);
        });
}
