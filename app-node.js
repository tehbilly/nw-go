(function(){
  var child = require('child_process');
  var goapp = child.spawn('./nw-go.exe');
  exports.goapp = goapp;
})();
