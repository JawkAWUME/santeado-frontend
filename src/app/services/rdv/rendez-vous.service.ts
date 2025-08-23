import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RendezVous } from '../../interfaces/rendez-vous';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private apiUrl = 'http://localhost:10001/api/rendezvous'; // adapte selon ton backend
  
  constructor(private http: HttpClient) { }

  getRendezVousPatient(patientId: number) {
    return this.http.get<RendezVous[]>(`${this.apiUrl}/patient/${patientId}`);
  }

   getRendezVousPro(proSanteId: number) {
    return this.http.get<RendezVous[]>(`${this.apiUrl}/pro/${proSanteId}`);
  }


  getCreneauxDisponibles(proSanteId: number, date: string | Date) {
    if (typeof date === 'string') {
      const formattedDate = date.toString().split('T')[0]; // Format YYYY-MM-DD
      return this.http.get(`${this.apiUrl}/creneaux-disponibles?proId=${proSanteId}&date=${formattedDate}`);
    }
    const formattedDate = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    return this.http.get(`${this.apiUrl}/creneaux-disponibles?proId=${proSanteId}&date=${formattedDate}`);
  }

  creerRendezVous(rdv: RendezVous) {
    return this.http.post<RendezVous>(`${this.apiUrl}`, rdv);
  }

  modifierRendezVous(id: number, updatedRdv: RendezVous) {
    return this.http.put<RendezVous>(`${this.apiUrl}/${id}`, updatedRdv);
  }
}
