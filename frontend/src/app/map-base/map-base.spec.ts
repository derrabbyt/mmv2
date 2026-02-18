import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBase } from './map-base';

describe('MapBase', () => {
  let component: MapBase;
  let fixture: ComponentFixture<MapBase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapBase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapBase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
