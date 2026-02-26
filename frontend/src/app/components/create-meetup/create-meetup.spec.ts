import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMeetupComponent } from './create-meetup';

describe('CreateMeetupComponent', () => {
    let component: CreateMeetupComponent;
    let fixture: ComponentFixture<CreateMeetupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateMeetupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CreateMeetupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have empty form fields initially', () => {
        expect(component.meetup.title).toBe('');
        expect(component.meetup.date).toBe('');
        expect(component.meetup.startTime).toBe('');
        expect(component.meetup.endTime).toBe('');
        expect(component.meetup.city).toBe('');
        expect(component.meetup.pinCode).toBe('');
    });

    it('should have a list of cities', () => {
        expect(component.cities.length).toBeGreaterThan(0);
        expect(component.cities).toContain('Berlin');
    });
});
