require('serve')('./build', {
  open: true
});

'./build/**/*'; // Hack to make Zeit's PKG cache all of build.