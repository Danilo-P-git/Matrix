import { ColorPickerDirective } from 'ngx-color-picker';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import {  provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, RouterOutlet, provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ToastrModule } from 'ngx-toastr';
import { FlatpickrDefaults } from 'angularx-flatpickr';
import { provideHttpClient } from '@angular/common/http';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),    provideZonelessChangeDetection(),

        provideClientHydration(), RouterOutlet,RouterModule,BrowserModule,provideAnimations(),FlatpickrDefaults,AngularFireModule,

    AngularFireDatabaseModule,BrowserModule,

    AngularFirestoreModule,  provideHttpClient(),
    AngularFireAuthModule,
  importProvidersFrom(ColorPickerDirective, AngularFireModule.initializeApp(environment.firebase),

 ToastrModule.forRoot({
    timeOut: 15000, // 15 seconds
    closeButton: true,
    progressBar: true,

  }),),]

};
