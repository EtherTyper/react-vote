require('serve')('./build', {
  port: 5001,
  open: true
});

'./build/**/*'; // Hack to make Zeit's PKG cache all of build.