export default function version() {
    this.controls.rendererWrap.append('span').text('Version: ');
    this.controls.versionSelect = this.controls.rendererWrap.append('select');
    this.controls.rendererWrap.append('br');
}
