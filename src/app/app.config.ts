import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import * as echarts from 'echarts';
import { provideEchartsCore } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideEchartsCore({ echarts }),
    provideRouter(routes),
    provideHttpClient(),
    provideNativeDateAdapter(),
    importProvidersFrom(
      FullCalendarModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatStepperModule,
      ReactiveFormsModule,
    )
  ]
};
