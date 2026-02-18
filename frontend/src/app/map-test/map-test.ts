import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
    selector: 'app-map-test',
    standalone: true,
    imports: [CommonModule, GoogleMapsModule],
    templateUrl: './map-test.html',
    styleUrl: './map-test.css'
})
export class MapTestComponent {
    center: google.maps.LatLngLiteral = { lat: 52.520008, lng: 13.404954 }; // Berlin
    zoom = 12;

    mapOptions: google.maps.MapOptions = {
        mapTypeId: 'roadmap',
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        maxZoom: 20,
        minZoom: 8,
    };
}
