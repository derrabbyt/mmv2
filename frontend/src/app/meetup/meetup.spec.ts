import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Meetup } from './meetup';

describe('Meetup', () => {
  let component: Meetup;
  let fixture: ComponentFixture<Meetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Meetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Meetup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
