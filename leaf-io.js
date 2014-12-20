var http = require('http');
var gpio = require('pi-gpio');

var pinValue = 0;

function writePin(pinNumber, value) {
  gpio.open(pinNumber, "output", function(err) {
    gpio.write(pinNumber, value, function() {
      console.log('wrote ' + value + ' to ' + pinNumber);
      gpio.close(pinNumber);
    });
  });
}

function togglePin(pinNumber) {
    pinValue = (pinValue === 1) ? 0 : 1;
    writePin(pinNumber, pinValue);
}

var server = http.createServer(function(request, response) {
  var pinNumber = request.url.substring(1, request.url.indexOf('/', 1));
  var action    = request.url.substring(request.url.indexOf('/', 1) + 1);

  switch (action) {
    case 'on':
      writePin(pinNumber, 1);
      response.write('set ' + pinNumber + ' on');
      break;

    case 'off':
      writePin(pinNumber, 0);
      response.write('set ' + pinNumber + ' off');
      break;

    case 'toggle':
      togglePin(pinNumber);
      response.write('set ' + pinNumber + ' to ' + pinValue);
      break;

    default:
      response.write('nothing here');
  }

  response.end();
});
server.listen(8080);