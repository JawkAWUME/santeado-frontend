import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaiementRequest } from '../../interfaces/paiement.request';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:10001/api/paiements';

  constructor(private http: HttpClient) {}

  /** Paiement direct (sans PayTech) */
  effectuerPaiement(dto: PaiementRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payer`, dto);
  }

  /** Initier un paiement via PayTech (Wave / Orange Money) */
  initierPaiement(dto: PaiementRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/initier`, dto);
  }

  /** Récupérer le montant restant à payer d’un patient */
  getMontantAPayer(patientId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/montant/${patientId}`);
  }

  /** Récupérer les détails d’un paiement */
  getDetailPaiement(paiementId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/details/${paiementId}`);
  }

  /** Lister les factures d’un patient */
  getFacturesPatient(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/factures/${patientId}`);
  }

  /** Supprimer une facture */
  supprimerFacture(factureId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/factures/${factureId}`);
  }

  /** Télécharger une facture PDF */
  telechargerFacture(factureId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/factures/${factureId}/pdf`, { responseType: 'blob' });
  }
}
