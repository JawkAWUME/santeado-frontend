import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaiementRequest } from '../../interfaces/paiement.request';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private baseUrl = 'http://localhost:10001/api/paiements';

  constructor(private http: HttpClient) {}

  /**
   * 1️⃣ Initier un paiement sur le serveur et récupérer l'URL PayTech
   * @param dto PaiementRequest
   */
  initierPaiement(dto: PaiementRequest): Observable<{ paiementUrl: string, paiementId: number }> {
    return this.http.post<{ paiementUrl: string, paiementId: number }>(`${this.baseUrl}/initier`, dto);
  }

  /**
   * 2️⃣ Vérifier le statut d'un paiement existant
   * @param paiementId Identifiant du paiement
   */
  getDetailPaiement(paiementId: number): Observable<PaiementRequest> {
    return this.http.get<PaiementRequest>(`${this.baseUrl}/details/${paiementId}`);
  }

  /**
   * 3️⃣ Lister toutes les factures d’un patient
   * @param patientId Identifiant du patient
   */
  getFacturesPatient(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/factures/${patientId}`);
  }

  /**
   * 4️⃣ Supprimer une facture (optionnel, admin seulement)
   * @param factureId Identifiant de la facture
   */
  supprimerFacture(factureId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/factures/${factureId}`);
  }
}
