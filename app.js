(function() {
  var child = require('child_process');
  var goapp = child.spawn('./nw-go.exe');
  var rpcID = 0;

  // Helper functions for "logging"
  var logOk = function(text) {
    window.document.getElementById('go-stdout').innerHTML = window.document.getElementById('go-stdout').innerHTML + text + "\n";
  };
  var logErr = function(text) {
    window.document.getElementById('go-stdout').innerHTML
      = window.document.getElementById('go-stdout').innerHTML + "<span style='color:red;'>" + text + "</span>\n";
  }

  goapp.stdout.on('data', function(d) {
    var resp = JSON.parse(d);
    if (resp.error != null) {
      console.log("[rpc-err] " + resp.error);
      logErr(resp.error);
    } else {
      console.log("[rpc-ok]  " + resp.result.Data);
      logOk(resp.result.Data);
    }
    console.log("[goapp] " + d); // Coercing to string.
  });

  goapp.stderr.on('data', function(d) {
    window.getElementById('go-stdout').innerHTML = window.getElementById('go-stdout').innerHTML + "<span style='color:red;'>[error] " + d + "</span>";
    console.log('[stderr] ' + d);
  });

  goapp.on('close', function(c) {
    window.getElementById('go-stdout').innerHTML = window.getElementById('go-stdout').innerHTML + 'Go subprocess exited with code: ' + c + '\n';
    console.log('Process closed with exit code: ' + c);
  });

  //var sayInput = document.getElementById('send-to-goapp');
  exports.echo = function(text) {
    goapp.stdin.write(JSON.stringify({
      id: rpcID++,
      method: "Test.Echo",
      params: [{data: text}]
    }) + '\n');
  };
})();
