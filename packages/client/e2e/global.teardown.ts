import { exec } from 'child_process';
import { test as teardown } from '@playwright/test'

// this is basically a copy of the kill script configured to run as teardown
// if you're running a bunch of tests you don't want to stop/start the runtime every time FYI
teardown('Closing application...', async () => {
  const isWindows = process.platform.startsWith('win');
  console.log('Running on Windows:', isWindows);

  const cmd = isWindows
    ? `cmd.exe /c taskkill /F /IM OpenFin.exe /T & cmd.exe /c taskkill /F /IM OpenFinRVM.exe /T`
    : `pkill -9 OpenFin`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(error.message);
      return;
    }

    if (stderr) {
      console.log(stderr);
      return;
    }

    console.log(stdout);
  });
})
