import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { CreateMeetupComponent } from './create-meetup/create-meetup';
import { Meetup } from './meetup/meetup';
import { MaplibreTest } from './maplibre-test/maplibre-test';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'create-meetup', component: CreateMeetupComponent },
    { path: 'meetup', component: Meetup },
    { path: 'maplibre-test', component: MaplibreTest }
];
