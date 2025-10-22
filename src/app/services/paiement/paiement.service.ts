import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaiementRequest } from '../../interfaces/paiement.request';
import { Facture } from '../../interfaces/facture';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:10001/api/paiements';

  constructor(private http: HttpClient) {}

  /** Paiement direct (paiement partiel ou total) pour une facture */
  effectuerPaiement(factureId: number, dto: PaiementRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payer/${factureId}`, dto);
  }

  /** Initier un paiement via PayTech (Wave / Orange Money) pour une facture */
  initierPaiementPourFacture(factureId: number, dto: PaiementRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/initier/${factureId}`, dto);
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
  getFacturesPatient(patientId: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/factures/${patientId}`);
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
