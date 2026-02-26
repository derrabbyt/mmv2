import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { CreateMeetupComponent } from './components/create-meetup/create-meetup';
import { Meetup } from './components/meetup/meetup';
import { MaplibreTest } from './components/maplibre-test/maplibre-test';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'create-meetup', component: CreateMeetupComponent },
    { path: 'meetup', component: Meetup },
    { path: 'maplibre-test', component: MaplibreTest }
];
