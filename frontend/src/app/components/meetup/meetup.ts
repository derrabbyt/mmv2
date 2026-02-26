import { Component, HostListener, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapBase } from '../map-base/map-base';

interface Card {
  id: number;
  image: string;
  title: string;
  description?: string;
  location: string;
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
  rating: number;
  reviewCount: number;
  type: string;
  openingHours: string;
  averageTravelTime: number; // in minutes
  isFavorite: boolean;
  images: string[];
  participantTravelTimes: { [name: string]: number };
  isAnimating?: boolean;
}

@Component({
  selector: 'app-meetup',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule, MapBase],
  templateUrl: './meetup.html',
  styleUrl: './meetup.css',
})
export class Meetup implements OnInit {
  constructor(private cdr: ChangeDetectorRef) { }

  currentCards: Card[] = [];

  ngOnInit() {
    this.updateView();
  }

  updateView() {
    if (this.activeList === 'places') {
      // Favorites: Sort by net votes (likes - dislikes)
      this.currentCards = [...this.placesCards].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
    } else {
      // Suggested: Sort by average travel time (ascending)
      this.currentCards = [...this.activitiesCards].sort((a, b) => a.averageTravelTime - b.averageTravelTime);
    }
    this.cdr.detectChanges();
  }

  title = 'díngs 2025';

  // Meetup details from create-meetup (pinCode excluded)
  date = 'March 15, 2025';
  startTime = '14:00';
  endTime = '18:00';
  city = 'Berlin';
  types = ['Café', 'Bar']; // Selected meetup types

  // Favorites Removal Confirmation
  cardToRemove: Card | null = null;
  showRemoveConfirmPopup = false;

  // Collapsible Header - Responsive
  isHeaderCollapsed = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    // Only handle window scroll on mobile/tablet or when layout isn't fixed
    if (window.innerWidth < 1024) {
      this.isHeaderCollapsed = window.scrollY > 20;
    }
  }

  onScroll(event: Event) {
    // Only handle element scroll on desktop (large screens)
    if (window.innerWidth >= 1024) {
      const target = event.target as HTMLElement;
      this.isHeaderCollapsed = target.scrollTop > 20;
    }
  }

  toggleLike(card: Card) {
    if (card.userVote === 'like') {
      // Remove like
      card.likes--;
      card.userVote = null;
    } else {
      // Add like, removing dislike if exists
      if (card.userVote === 'dislike') {
        card.dislikes--;
      }
      card.likes++;
      card.userVote = 'like';
    }
  }

  toggleDislike(card: Card) {
    if (card.userVote === 'dislike') {
      // Remove dislike
      card.dislikes--;
      card.userVote = null;
    } else {
      // Add dislike, removing like if exists
      if (card.userVote === 'like') {
        card.likes--;
      }
      card.dislikes++;
      card.userVote = 'dislike';
    }
  }


  addToFavorites(card: Card) {
    if (!card.isFavorite) {
      card.isAnimating = true; // Trigger animation
      this.cdr.detectChanges(); // Ensure animation starts immediately
      card.isFavorite = true;
      setTimeout(() => {
        const index = this.activitiesCards.findIndex(c => c.id === card.id);
        if (index !== -1) {
          const [movedCard] = this.activitiesCards.splice(index, 1);
          this.placesCards.push(movedCard);
          // Force reference update
          this.placesCards = [...this.placesCards];
          this.activitiesCards = [...this.activitiesCards];
        }
        card.isAnimating = false; // Always reset
        this.updateView();
      }, 500);
    } else {
      this.cardToRemove = card;
      this.showRemoveConfirmPopup = true;
    }
  }

  confirmRemoveFromFavorites() {
    if (this.cardToRemove) {
      const card = this.cardToRemove;
      // Trigger animation
      card.isAnimating = true;
      this.cdr.detectChanges(); // Ensure animation starts immediately

      // Immediate visual feedback for icon
      card.isFavorite = false;
      this.showRemoveConfirmPopup = false;
      this.cardToRemove = null;

      // Delayed list move after animation
      setTimeout(() => {
        const index = this.placesCards.findIndex(c => c.id === card.id);
        if (index !== -1) {
          const [movedCard] = this.placesCards.splice(index, 1);
          this.activitiesCards.push(movedCard);
          // Force reference update
          this.placesCards = [...this.placesCards];
          this.activitiesCards = [...this.activitiesCards];
        }
        card.isAnimating = false; // Always reset
        this.updateView();
      }, 500);
    }

  }


  cancelRemoveFromFavorites() {
    if (this.cardToRemove) {
      this.cardToRemove = null;
      this.showRemoveConfirmPopup = false;
    }
  }

  placesCards: Card[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      title: 'Cozy Mountain Cabin',
      description: 'Beautiful cabin with stunning mountain views',
      location: 'Swiss Alps',
      likes: 12,
      dislikes: 1,
      rating: 4.8,
      reviewCount: 124,
      type: 'Cabin',
      openingHours: 'Open 24 hours',
      averageTravelTime: 45,
      isFavorite: true,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        'https://images.unsplash.com/photo-1518730518541-d0843268c287?w=400',
        'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?w=400'
      ],
      participantTravelTimes: { 'You': 40, 'Simon': 50 }
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
      title: 'Lakeside Villa',
      description: 'Peaceful retreat by the crystal clear lake',
      location: 'Lake Como, Italy',
      likes: 8,
      dislikes: 0,
      rating: 4.9,
      reviewCount: 89,
      type: 'Villa',
      openingHours: 'Check-in: 3 PM',
      averageTravelTime: 30,
      isFavorite: true,
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=400',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
      ],
      participantTravelTimes: { 'You': 25, 'Simon': 35 }
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
      title: 'Modern City Loft',
      description: 'Stylish loft in the heart of downtown',
      location: 'Berlin, Germany',
      likes: 24,
      dislikes: 2,
      rating: 4.7,
      reviewCount: 215,
      type: 'Apartment',
      openingHours: 'Check-in: 2 PM',
      averageTravelTime: 15,
      isFavorite: true,
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
      ],
      participantTravelTimes: { 'You': 10, 'Simon': 20 }
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      title: 'Beach House',
      description: 'Oceanfront property with private beach access',
      location: 'Barcelona, Spain',
      likes: 15,
      dislikes: 3,
      rating: 4.6,
      reviewCount: 156,
      type: 'House',
      openingHours: 'Check-in: 4 PM',
      averageTravelTime: 25,
      isFavorite: true,
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400',
        'https://images.unsplash.com/photo-1520483602335-a4a893a677e7?w=400'
      ],
      participantTravelTimes: { 'You': 25, 'Simon': 25 }
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      title: 'Countryside Cottage',
      description: 'Charming cottage surrounded by nature',
      location: 'Provence, France',
      likes: 6,
      dislikes: 0,
      rating: 4.9,
      reviewCount: 42,
      type: 'Cottage',
      openingHours: 'Check-in: 1 PM',
      averageTravelTime: 60,
      isFavorite: true,
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
        'https://images.unsplash.com/photo-1464288550599-f2d536304c77?w=400',
        'https://images.unsplash.com/photo-1510627489930-0c1b0dc58e85?w=400'
      ],
      participantTravelTimes: { 'You': 55, 'Simon': 65 }
    }
  ];

  activitiesCards: Card[] = [
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
      title: 'Mountain Hiking',
      description: 'Explore scenic trails and breathtaking views',
      location: 'Swiss Alps',
      likes: 0,
      dislikes: 0,
      rating: 4.8,
      reviewCount: 340,
      type: 'Hiking Area',
      openingHours: 'Open until 8 PM',
      averageTravelTime: 50,
      isFavorite: false,
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
        'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
        'https://images.unsplash.com/photo-1502421935066-7353b349d379?w=400'
      ],
      participantTravelTimes: { 'You': 45, 'Simon': 55 }
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      title: 'Wine Tasting Tour',
      description: 'Sample the finest local wines',
      location: 'Tuscany, Italy',
      likes: 0,
      dislikes: 0,
      rating: 4.9,
      reviewCount: 520,
      type: 'Winery',
      openingHours: 'Closes 6 PM',
      averageTravelTime: 35,
      isFavorite: false,
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
        'https://images.unsplash.com/photo-1598460677103-bd0878563de3?w=400',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400'
      ],
      participantTravelTimes: { 'You': 30, 'Simon': 40 }
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400',
      title: 'Cooking Class',
      description: 'Learn to cook authentic regional cuisine',
      location: 'Paris, France',
      likes: 0,
      dislikes: 0,
      rating: 4.7,
      reviewCount: 180,
      type: 'Cooking School',
      openingHours: 'Closes 9 PM',
      averageTravelTime: 20,
      isFavorite: false,
      images: [
        'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400',
        'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=400',
        'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400'
      ],
      participantTravelTimes: { 'You': 15, 'Simon': 25 }
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
      title: 'Surfing Lesson',
      description: 'Catch your first wave with expert instructors',
      location: 'Lisbon, Portugal',
      likes: 0,
      dislikes: 0,
      rating: 4.8,
      reviewCount: 290,
      type: 'Surf School',
      openingHours: 'Closes 7 PM',
      averageTravelTime: 40,
      isFavorite: false,
      images: [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
        'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400',
        'https://images.unsplash.com/photo-1415931633537-351070d20b81?w=400'
      ],
      participantTravelTimes: { 'You': 35, 'Simon': 45 }
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400',
      title: 'Yoga Retreat',
      description: 'Find your inner peace in a serene setting',
      location: 'Bali, Indonesia',
      likes: 0,
      dislikes: 0,
      rating: 4.9,
      reviewCount: 450,
      type: 'Wellness Center',
      openingHours: 'Open 24 hours',
      averageTravelTime: 10,
      isFavorite: false,
      images: [
        'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400',
        'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=400',
        'https://images.unsplash.com/photo-1588286840104-4bd2a1668e8e?w=400'
      ],
      participantTravelTimes: { 'You': 5, 'Simon': 15 }
    }
  ];

  guests = [
    { name: 'You', location: 'Berlin Mitte', transport: 'walking', tolerance: 15, voted: true },
    { name: 'Simon', location: 'Berlin Kreuzberg', transport: 'bicycle', tolerance: 30, voted: true },
    { name: 'You', location: 'Berlin Mitte', transport: 'walking', tolerance: 15, voted: true },
    { name: 'Simon', location: 'Berlin Kreuzberg', transport: 'bicycle', tolerance: 30, voted: true },
    { name: 'You', location: 'Berlin Mitte', transport: 'walking', tolerance: 15, voted: true },
    { name: 'Simon', location: 'Berlin Kreuzberg', transport: 'bicycle', tolerance: 30, voted: true },
    { name: 'You', location: 'Berlin Mitte', transport: 'walking', tolerance: 15, voted: true },
    { name: 'Simon', location: 'Berlin Kreuzberg', transport: 'bicycle', tolerance: 30, voted: true },
    { name: 'You', location: 'Berlin Mitte', transport: 'walking', tolerance: 15, voted: true },
    { name: 'Simon', location: 'Berlin Kreuzberg', transport: 'bicycle', tolerance: 30, voted: true },
    { name: 'You', location: 'Berlin Mitte', transport: 'walking', tolerance: 15, voted: true },
    { name: 'Simon', location: 'Berlin Kreuzberg', transport: 'bicycle', tolerance: 30, voted: true },
  ];

  // Popup states
  showGuestListPopup = false;
  showEditGuestPopup = false;
  showAddGuestPopup = false;
  showSharePopup = false;
  linkCopied = false;

  newGuestName = '';
  newGuestLocation = '';
  newGuestTransport = 'walking';
  newGuestTolerance = 15;

  // Location Details Popup
  selectedCard: Card | null = null;
  currentImageIndex = 0;

  openLocationDetails(card: Card) {
    this.selectedCard = card;
    this.currentImageIndex = 0;
  }

  closeLocationDetails() {
    this.selectedCard = null;
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.selectedCard && this.selectedCard.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedCard.images.length;
    }
  }

  prevImage(event: Event) {
    event.stopPropagation();
    if (this.selectedCard && this.selectedCard.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.selectedCard.images.length) % this.selectedCard.images.length;
    }
  }

  getParticipantTravelTime(guestName: string, card?: Card): number {
    const targetCard = card || this.selectedCard;
    return targetCard?.participantTravelTimes[guestName] || 0;
  }

  editingGuestIndex: number | null = null;
  editingGuestName = '';
  editingGuestLocation = '';
  editingGuestTransport = 'walking';
  editingGuestTolerance = 15;

  transportOptions = [
    { value: 'walking', label: 'Walking', icon: '🚶' },
    { value: 'bicycle', label: 'Bicycle', icon: '🚴' },
    { value: 'car', label: 'Car', icon: '🚗' },
    { value: 'public_transport', label: 'Public Transport', icon: '🚌' },
    { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
    { value: 'taxi', label: 'Taxi', icon: '🚕' }
  ];



  activeList: 'places' | 'activities' = 'places';

  switchList(list: 'places' | 'activities') {
    this.activeList = list;
    this.updateView();
  }

  // Form fields
  showAddLocationForm = false;
  newLocationAddress = '';

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getTransportOption(value: string) {
    return this.transportOptions.find(t => t.value === value);
  }

  openEditGuestPopup(guest: any) {
    const index = this.guests.indexOf(guest);
    if (index !== -1) {
      this.editingGuestIndex = index;
      this.editingGuestName = guest.name;
      this.editingGuestLocation = guest.location;
      this.editingGuestTransport = guest.transport;
      this.editingGuestTolerance = guest.tolerance;
      this.showGuestListPopup = false;
      this.showEditGuestPopup = true;
    }
  }

  getMeetupLink(): string {
    return window.location.href;
  }

  copyMeetupLink() {
    navigator.clipboard.writeText(this.getMeetupLink());
    this.linkCopied = true;
    setTimeout(() => {
      this.linkCopied = false;
    }, 2000);
  }


  addGuest() {
    if (this.newGuestName.trim() && this.newGuestLocation.trim()) {
      this.guests.push({
        name: this.newGuestName.trim(),
        location: this.newGuestLocation.trim(),
        transport: this.newGuestTransport,
        tolerance: this.newGuestTolerance,
        voted: false
      });
      this.newGuestName = '';
      this.newGuestLocation = '';
      this.newGuestTransport = 'walking';
      this.newGuestTolerance = 15;
    }
  }

  removeGuest(index: number) {
    this.guests.splice(index, 1);
  }

  removeGuestFromList(guest: any) {
    const index = this.guests.indexOf(guest);
    if (index !== -1) {
      this.guests.splice(index, 1);
    }
  }

  startEditGuest(index: number) {
    this.editingGuestIndex = index;
    this.editingGuestName = this.guests[index].name;
    this.editingGuestLocation = this.guests[index].location;
    this.editingGuestTransport = this.guests[index].transport;
    this.editingGuestTolerance = this.guests[index].tolerance;
  }

  saveEditGuest() {
    if (this.editingGuestIndex !== null && this.editingGuestName.trim() && this.editingGuestLocation.trim()) {
      this.guests[this.editingGuestIndex].name = this.editingGuestName.trim();
      this.guests[this.editingGuestIndex].location = this.editingGuestLocation.trim();
      this.guests[this.editingGuestIndex].transport = this.editingGuestTransport;
      this.guests[this.editingGuestIndex].tolerance = this.editingGuestTolerance;
      this.editingGuestIndex = null;
      this.editingGuestName = '';
      this.editingGuestLocation = '';
      this.editingGuestTransport = 'walking';
      this.editingGuestTolerance = 15;
    }
  }

  cancelEditGuest() {
    this.editingGuestIndex = null;
    this.editingGuestName = '';
    this.editingGuestLocation = '';
    this.editingGuestTransport = 'walking';
    this.editingGuestTolerance = 15;
  }



  addCustomLocation() {
    if (!this.newLocationAddress.trim()) {
      return; // Don't add if field is empty
    }

    const newCard: Card = {
      id: Date.now(), // Simple unique ID
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400', // Default placeholder image
      title: this.newLocationAddress.trim(),
      description: 'Custom location',
      location: this.newLocationAddress.trim(),
      likes: 0,
      dislikes: 0,
      rating: 0,
      reviewCount: 0,
      type: 'Custom',
      openingHours: 'Unknown',
      averageTravelTime: 0,
      isFavorite: true,
      images: ['https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400'],
      participantTravelTimes: {}
    };

    this.placesCards.unshift(newCard); // Add to beginning of list

    // Clear form
    this.newLocationAddress = '';
  }


  onPoiClick(place: google.maps.places.PlaceResult) {
    const photos = place.photos?.map(p => p.getUrl({ maxWidth: 400 })).filter((url): url is string => !!url) || [];
    // Fallback image if no photos
    if (photos.length === 0) {
      photos.push('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400');
    }

    const newCard: Card = {
      id: -1, // Temporary ID for POI
      image: photos[0],
      title: place.name || 'Unknown Place',
      description: 'Google Maps Place',
      location: place.formatted_address || '',
      likes: 0,
      dislikes: 0,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      type: place.types?.[0]?.replace('_', ' ') || 'Place',
      openingHours: place.opening_hours?.isOpen() ? 'Open now' : 'Closed',
      averageTravelTime: 15, // Mock travel time
      isFavorite: false,
      images: photos,
      participantTravelTimes: {}
    };

    this.selectedCard = newCard;
    this.currentImageIndex = 0;
    this.cdr.detectChanges();
  }

  trackById(index: number, card: Card): number {
    return card.id;
  }
}
