import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxMapLibreGLModule, MapComponent, GeoJSONSourceComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';
import { FeatureCollection, Feature, Point } from 'geojson';
import { MapMouseEvent } from 'maplibre-gl';

@Component({
  selector: 'app-maplibre-test',
  standalone: true,
  imports: [CommonModule, MapComponent, GeoJSONSourceComponent, LayerComponent, NgxMapLibreGLModule],
  templateUrl: './maplibre-test.html',
  styleUrls: ['./maplibre-test.css']
})
export class MaplibreTest {
  center: [number, number] = [16.3725, 48.2087];

  poiData: FeatureCollection = { type: 'FeatureCollection', features: [] };
  currentRoute: FeatureCollection = { type: 'FeatureCollection', features: [] };
  clickedPoints: FeatureCollection = { type: 'FeatureCollection', features: [] };

  // Track the two selected points for routing
  private selectedPoints: [number, number][] = [];

  routeStatus: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPois();
  }

  loadPois(): void {
    this.routeStatus = 'Loading POIs...';
    this.http.get<FeatureCollection>('/api/test/pois?count=20').subscribe({
      next: (fc) => {
        this.poiData = fc;
        this.routeStatus = `Loaded ${fc.features.length} POIs. Click two points on the map to route.`;
      },
      error: (err) => {
        console.error('Failed to load POIs:', err);
        this.routeStatus = 'Failed to load POIs.';
      }
    });
  }

  onMapClick(event: MapMouseEvent): void {
    const lngLat = event.lngLat;
    if (!lngLat) return;

    const point: [number, number] = [lngLat.lng, lngLat.lat];
    this.selectedPoints.push(point);

    // Update the clicked points markers
    this.clickedPoints = {
      type: 'FeatureCollection',
      features: this.selectedPoints.map((p, i) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: p },
        properties: { label: i === 0 ? 'A' : 'B', index: i }
      }))
    };

    if (this.selectedPoints.length === 1) {
      this.routeStatus = 'Start point selected. Click a second point for the destination.';
    }

    if (this.selectedPoints.length >= 2) {
      this.calculateRoute(this.selectedPoints[0], this.selectedPoints[1]);
      this.selectedPoints = [];
    }
  }

  private calculateRoute(start: [number, number], end: [number, number]): void {
    this.routeStatus = 'Calculating route...';

    const body = {
      start: { lon: start[0], lat: start[1] },
      end: { lon: end[0], lat: end[1] },
      costing: 'auto'
    };

    this.http.post<FeatureCollection>('/api/test/route', body).subscribe({
      next: (fc) => {
        this.currentRoute = fc;
        const props = fc.features[0]?.properties;
        if (props) {
          const distKm = (props['distance_m'] / 1000).toFixed(1);
          const durMin = (props['duration_s'] / 60).toFixed(0);
          this.routeStatus = `Route: ${distKm} km, ~${durMin} min. Click two new points to reroute.`;
        } else {
          this.routeStatus = 'Route displayed. Click two new points to reroute.';
        }
      },
      error: (err) => {
        console.error('Failed to calculate route:', err);
        this.routeStatus = 'Route calculation failed. Click two points to try again.';
        this.currentRoute = { type: 'FeatureCollection', features: [] };
      }
    });
  }

  onMapLoad(event: any): void {
    console.log('Map loaded:', event);
  }
}
