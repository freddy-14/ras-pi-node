var http = require('http');
var fs   = require('fs');
var gpio = require('pi-gpio');

var pinValue = 0;

function writePin(pinNumber, value) {
  gpio.open(pinNumber, "output", function(err) {
    gpio.write(pinNumber, value, function() {
      console.log('Wrote ' + value + ' to ' + pinNumber);
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

  try {
  switch (action) {
    case 'on':
      writePin(pinNumber, 1);
      response.write('Set pin ' + pinNumber + ' to on.');
	  response.end();
      break;

    case 'off':
      writePin(pinNumber, 0);
      response.write('Set pin ' + pinNumber + ' to off.');
	  response.end();
      break;

    case 'toggle':
      togglePin(pinNumber);
      response.write('Set pin ' + pinNumber + ' to ' + pinValue);
	  response.end();
      break;

    default:
	  fs.createReadStream(__dirname + '/control.html').pipe(response);
  }
  } catch(e) {
    response.write('Invalid pin number.');
	response.end();
  }
});
server.listen(8080);
