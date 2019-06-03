export default function library() {
    this.controls.rendererWrap.append('span').text('Library: ');
    this.controls.rendererSelect = this.controls.rendererWrap.append('select');
    this.controls.rendererWrap.append('br');
}
