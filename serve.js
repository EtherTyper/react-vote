const path = require('path');

require('serve')(path.join(__dirname, 'build'), {
  port: 5001,
  open: true
});