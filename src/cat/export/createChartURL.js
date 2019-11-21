export default function createChartURL() {
    console.log(this.current);
    // const root_url = 'https://rhoinc.github.io/CAT/';
    const root_url = 'http://localhost:8000/';
    const se = btoa(JSON.stringify(this.current.config, null, ' '));
    const re = btoa(this.current.name);
    const de = btoa(this.current.data);
    const ve = btoa(this.current.version);
    const url = root_url + '?re=' + re + '&ve=' + ve + '&de=' + de + '&se=' + se;
    return url;
}
