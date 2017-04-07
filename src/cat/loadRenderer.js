export function loadRenderer(src, callback, cat) {
  var s, r, t;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  s.onload = s.onreadystatechange = function() {
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
      r = true;
      callback(cat);
    }
  };
  t = document.getElementsByTagName('script')[0];
  t.parentNode.insertBefore(s, t);
}
