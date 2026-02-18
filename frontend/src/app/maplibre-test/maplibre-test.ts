import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxMapLibreGLModule, MapComponent, GeoJSONSourceComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';
import { FeatureCollection } from 'geojson';

@Component({
  selector: 'app-maplibre-test',
  standalone: true,
  imports: [CommonModule, MapComponent, GeoJSONSourceComponent, LayerComponent, NgxMapLibreGLModule],
  templateUrl: './maplibre-test.html',
  styleUrls: ['./maplibre-test.css']
})
export class MaplibreTest {
  center: [number, number] = [16.3725, 48.2087];

  venueData: FeatureCollection = { type: 'FeatureCollection', features: [] };

  // Always keep this as valid GeoJSON to avoid null issues
  // routeData: FeatureCollection = { type: 'FeatureCollection', features: [] };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSocialVenues();
    // this.loadRandomRoute();
  }

  fetchSocialVenues() {
    const query = `[out:json];(node["amenity"~"cafe|restaurant|bar"](around:500,48.2087,16.3725););out center;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    this.http.get<any>(url).subscribe(res => {
      console.log(res)
      this.venueData = {
        type: 'FeatureCollection',
        features: res.elements.map((el: any) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [el.lon, el.lat] },
          properties: { name: el.tags?.name ?? '(unnamed)' }
        }))
      };
      console.log(this.venueData)
    });
  }

  onMapLoad(event: any) {
    console.log('Map loaded:', event);
    this.http.get('/api/hello').subscribe(res => console.log(res))
  }

  // loadRandomRoute() {
  //   this.http.get<FeatureCollection>('http://localhost:8000/api/v1/map/random_route')
  //     .subscribe(fc => this.routeData = fc);
  // }
}
