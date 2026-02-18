import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-create-meetup',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-meetup.html',
    styleUrl: './create-meetup.css'
})
export class CreateMeetupComponent {
    meetup = {
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        city: '',
        pinCode: '',
        types: [] as string[]
    };

    cities = [
        'Berlin',
        'Hamburg',
        'Munich',
        'Cologne',
        'Frankfurt',
        'Stuttgart',
        'Düsseldorf',
        'Dortmund',
        'Essen',
        'Leipzig'
        // TODO: add city api

    ];

    meetupTypes = [
        'Café',
        'Bar',
        'Club',
        'Restaurant',
        'Gym',
        'Park',
        'Museum',
        'Cinema',
        'Sports'
    ];

    isDropdownOpen = false;
    isCityDropdownOpen = false;
    customType = '';

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

    toggleCustomType() {
        if (this.customType.trim()) {
            this.toggleType(this.customType.trim());
            this.customType = '';
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
        console.log('Meetup created:', this.meetup);
        // TODO: Handle form submission
    }
}
