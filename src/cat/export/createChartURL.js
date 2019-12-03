export default function createChartURL() {
    const root_url = `${window.location.origin}${window.location.pathname}`;
    const se = btoa(JSON.stringify(this.current.config, null, ' '));
    const re = btoa(this.current.name);
    const de = btoa(this.current.data);
    const ve = btoa(this.current.version);
    const url =
        root_url + '?re=' + re + '&ve=' + ve + '&de=' + de + '&se=' + se + '&draw&controls=min';
    return url;
}
