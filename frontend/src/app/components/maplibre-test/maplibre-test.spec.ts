import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaplibreTest } from './maplibre-test';

describe('MaplibreTest', () => {
  let component: MaplibreTest;
  let fixture: ComponentFixture<MaplibreTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaplibreTest]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MaplibreTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
