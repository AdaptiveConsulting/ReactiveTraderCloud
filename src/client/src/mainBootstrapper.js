import AppBootstrapper from './bootstrapper';
import NotificationBootstrapper from './notificationBootstrapper';

let runBootstrapper = location.pathname === '/' && location.hash.length === 0;

if(runBootstrapper) {
  new AppBootstrapper().run();
}

else if (location.hash == '#notification'){
  new NotificationBootstrapper().run();
}
