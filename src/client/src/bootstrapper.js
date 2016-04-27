import AppBootstrapper from './mainBootstrapper';
let runBootstrapper = location.pathname === '/' && location.hash.length === 0;

if(runBootstrapper) {
  new AppBootstrapper().run();
}
