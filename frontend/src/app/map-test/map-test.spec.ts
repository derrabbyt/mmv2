import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapTestComponent } from './map-test';

describe('MapTestComponent', () => {
    let component: MapTestComponent;
    let fixture: ComponentFixture<MapTestComponent>;

    beforeEach(async () => {
        // Mock Google Maps API
        (window as any).google = {
            maps: {
                Map: class {
                    constructor() { }
                    setOptions() { }
                },
                LatLng: class {
                    constructor(public lat: number, public lng: number) { }
                },
                MapTypeId: {
                    ROADMAP: 'roadmap'
                }
            }
        };

        await TestBed.configureTestingModule({
            imports: [MapTestComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapTestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have Berlin as default center', () => {
        expect(component.center.lat).toBe(52.520008);
        expect(component.center.lng).toBe(13.404954);
    });

    it('should have default zoom level of 12', () => {
        expect(component.zoom).toBe(12);
    });
});
