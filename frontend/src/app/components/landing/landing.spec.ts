import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing';

describe('LandingComponent', () => {
    let component: LandingComponent;
    let fixture: ComponentFixture<LandingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LandingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LandingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render two buttons with correct classes', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelectorAll('button').length).toBe(2);
        // Check for "Create new Meetup" button (bg-gray-900)
        const createBtn = compiled.querySelector('button.bg-gray-900');
        expect(createBtn).toBeTruthy();
        expect(createBtn?.textContent).toContain('Create new Meetup');

        // Check for "Enter Meetup Code" button (bg-white)
        const enterBtn = compiled.querySelector('button.bg-white');
        expect(enterBtn).toBeTruthy();
        expect(enterBtn?.textContent).toContain('Enter Meetup Code');
    });
});
