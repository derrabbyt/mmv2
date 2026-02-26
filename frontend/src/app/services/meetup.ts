import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MeetupCreate, MeetupResponse } from '../models/meetup.dto';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private apiUrl = '/api/meetup';

  constructor(private http: HttpClient) { }

  createMeetup(meetup: MeetupCreate): Observable<MeetupResponse> {
    return this.http.post<MeetupResponse>(this.apiUrl + '/', meetup);
  }

  getMeetup(id: string): Observable<MeetupResponse> {
    return this.http.get<MeetupResponse>(`${this.apiUrl}/${id}`);
  }
}
