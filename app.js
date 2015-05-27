var app = {};

// (function() {
  var goapp = process.mainModule.exports.goapp;
  var gui = require("nw.gui");
  var rpcID = 0;

  // Helper functions for "logging"
  var logOk = function(text) {
    document.getElementById('go-stdout').innerHTML += text.replace('\n', '') + "\n";
  };
  var logErr = function(text) {
    document.getElementById('go-stdout').innerHTML += "<span style='color:red;'>" + text.replace('\n', '') + "</span>\n";
  }

  goapp.stdout.on('data', function(d) {
    var inString = String(d);
    var typeRegexp = new RegExp(/(\w+): ?({[^}]+})/);

    if (typeRegexp.test(inString)) {
      var parts = typeRegexp.exec(inString);
      switch (parts[1]) {
        case "CMD":
          var cmdObj = JSON.parse(parts[2]);
          var cmd = cmdObj.module + ':' + cmdObj.method;
          switch (cmd) {
            case "window:show":
              gui.Window.get().show();
              break;
            case "window:hide":
              gui.Window.get().hide();
              break;
            default:
              console.warn("Unmatched command: " + cmd);
          }
          break;
        default:
          logErr("Got something else: " + parts[0]);
      }
    } else {
      logErr("Not matched: " + inString);
    }
  });

  goapp.stderr.on('data', function(d) {
    logErr('[error] ' + d);
    console.error('[stderr] ' + d);
  });

  goapp.on('close', function(c) {
    document.getElementById('go-stdout').innerHTML += 'Go subprocess exited with code: ' + c + '\n';
    console.log('Process closed with exit code: ' + c);
  });

  var echo = function(text) {
    goapp.stdin.write(JSON.stringify({
      id: rpcID++,
      method: "Test.Echo",
      params: [{data: text}]
    }) + '\n');
  };

  app.sendSomething = function() {
    echo(document.getElementById('send-to-goapp').value);
    document.getElementById('send-to-goapp').value = '';
  };

  app.sendShow = function() {
    goapp.stdin.write(JSON.stringify({
      id: rpcID++,
      method: "Window.Show",
      params: []
    }) + '\n');
  };
// })();
