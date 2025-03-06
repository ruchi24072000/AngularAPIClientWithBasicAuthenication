import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(withInterceptors([authInterceptor]))  // Provide HttpClient with interceptors here
//   ]
// }).catch(err => console.error(err));