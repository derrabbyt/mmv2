import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MeetupService } from '../../services/meetup';
import { MeetupCreate } from '../../models/meetup.dto';
import { CategoryEnum } from '../../utils/enums/category.enum';

@Component({
    selector: 'app-create-meetup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './create-meetup.html',
    styleUrl: './create-meetup.css'
})
export class CreateMeetupComponent {
    meetup = {
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        city: 'Vienna',
        pinCode: '',
        types: [] as string[]
    };

    cities = [
        'Vienna'
    ];

    // Load enums nicely for display, removing UNKNOWN
    meetupTypes = Object.values(CategoryEnum).filter(val => val !== CategoryEnum.UNKNOWN) as string[];

    isDropdownOpen = false;
    isCityDropdownOpen = false;
    isSubmitting = false;
    errorMessage = '';

    constructor(
        private meetupService: MeetupService,
        private router: Router
    ) { }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    toggleCityDropdown() {
        this.isCityDropdownOpen = !this.isCityDropdownOpen;
    }

    selectCity(city: string) {
        this.meetup.city = city;
        this.isCityDropdownOpen = false;
    }

    toggleType(type: string) {
        const index = this.meetup.types.indexOf(type);
        if (index > -1) {
            this.meetup.types.splice(index, 1);
        } else {
            this.meetup.types.push(type);
        }
    }

    isTypeSelected(type: string): boolean {
        return this.meetup.types.includes(type);
    }

    removeType(type: string) {
        const index = this.meetup.types.indexOf(type);
        if (index > -1) {
            this.meetup.types.splice(index, 1);
        }
    }

    onSubmit() {
        if (!this.meetup.title || !this.meetup.city || this.meetup.types.length === 0) {
            this.errorMessage = 'Please fill out all mandatory fields: Title, City, and at least one Type.';
            return;
        }

        this.isSubmitting = true;
        this.errorMessage = '';

        // Cast explicitly for DTO to pacify TypeScript strict types
        const payload: MeetupCreate = {
            title: this.meetup.title,
            city: this.meetup.city,
            types: this.meetup.types as CategoryEnum[],
            date: this.meetup.date || undefined,
            startTime: this.meetup.startTime || undefined,
            endTime: this.meetup.endTime || undefined,
            pinCode: this.meetup.pinCode || undefined
        };

        this.meetupService.createMeetup(payload).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                console.log('Meetup created successfully:', response);
                this.router.navigate(['/meetup']);
            },
            error: (err) => {
                this.isSubmitting = false;
                this.errorMessage = 'Failed to create meetup. Please try again.';
                console.error(err);
            }
        });
    }
}
