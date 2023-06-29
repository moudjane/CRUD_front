import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as cors from 'cors';

if (environment.production) {
  enableProdMode();
}

cors({ origin: 'http://localhost:4200' }); // Ajoutez cette ligne pour activer CORS

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
