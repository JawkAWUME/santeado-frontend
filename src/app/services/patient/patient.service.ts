import { Injectable } from '@angular/core';
import { Patient } from '../../interfaces/patient';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

   private apiUrlPatients = 'http://localhost:10001/api/patients'; // adapte selon ton backend
  constructor(private http: HttpClient) {}

   getPatients(): Observable<Patient[]> {
      return this.http.get<{ data: Patient[] }>(this.apiUrlPatients).pipe(
         map(response => response.data ?? [])
      );
   }


}
