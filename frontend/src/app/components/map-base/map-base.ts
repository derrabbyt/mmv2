import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map-base',
  imports: [GoogleMapsModule],
  templateUrl: './map-base.html',
  styleUrl: './map-base.css',
})
export class MapBase {
  @ViewChild(GoogleMap) mapComp!: GoogleMap;
  @Output() poiClick = new EventEmitter<google.maps.places.PlaceResult>();

  zoom = 14;
  center: google.maps.LatLngLiteral = { lat: 48.2082, lng: 16.3738 };

  options: google.maps.MapOptions = {
    streetViewControl: false,  // removes the pegman button
    mapTypeControl: false      // optional
  };

  async onMapClick(event: google.maps.MapMouseEvent) {
    const e = event as any;

    // Only set when clicking a POI (business/place), not the base map
    const placeId: string | undefined = e.placeId;
    if (!placeId) return;

    // Prevent default Google POI UI
    e.stop?.();

    // Load Places library (works with the importLibrary loader snippet)
    const { PlacesService } =
      (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;

    const map = this.mapComp.googleMap;
    if (!map) return;

    const service = new PlacesService(map);

    service.getDetails(
      {
        placeId,
        fields: ['name', 'place_id', 'formatted_address', 'geometry', 'rating', 'user_ratings_total', 'photos', 'opening_hours', 'types', 'website'],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          console.warn('getDetails failed:', status);
          return;
        }
        console.log('Place details:', place);
        this.poiClick.emit(place);
      }
    );
  }


}
