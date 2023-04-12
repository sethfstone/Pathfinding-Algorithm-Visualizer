import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/components-main/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
