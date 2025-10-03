import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DossierMedical } from '../../interfaces/dossier.medical';
import { Antecedents } from '../../interfaces/antecedents';
import { ExamenClinique } from '../../interfaces/examen.clinique';
import { InfosUrgence } from '../../interfaces/infos.urgence';
import { ExamensComplementaires } from '../../interfaces/examens-complementaires';
import { TraitementPrescription } from '../../interfaces/traitement-prescription';
import { DiagnosticMedical } from '../../interfaces/diagnostic.medical';
import { EvolutionSuivi } from '../../interfaces/evolution-suivi';
import { Correspondances } from '../../interfaces/correspondances';

@Injectable({
  providedIn: 'root'
})
export class DossierMedicalService {
  private baseUrl = 'http://localhost:10001/api/dossier';

  constructor(private http: HttpClient) {}

  getDossierByPatientId(patientId: number) : Observable<DossierMedical[]> {
    return this.http.get<DossierMedical[]>(`${this.baseUrl}/patient/${patientId}`);
  }

  getDossierById(dossierId: number) : Observable<DossierMedical[]> {
    return this.http.get<DossierMedical[]>(`${this.baseUrl}/${dossierId}`);
  }

  getDossiers(): Observable<DossierMedical[]> {
    return this.http.get<DossierMedical[]>(`${this.baseUrl}/all`);
  }

  getMesDossiers(): Observable<DossierMedical[]> {
    return this.http.get<DossierMedical[]>(`${this.baseUrl}/mes-dossiers`);
  }

  searchDossiers(patientId?: number, filterDate?: string, patientName?: string): Observable<any[]> {
    let params = new HttpParams();
    if (patientId) params = params.set('patientId', patientId.toString());
    if (filterDate) params = params.set('filterDate', filterDate);
    if (patientName) params = params.set('patientName', patientName);

    return this.http.get<any[]>(`${this.baseUrl}/search`, { params });
  }

  creerDossier(patientId: number): Observable<DossierMedical> {
    return this.http.post<DossierMedical>(`${this.baseUrl}/creer/${patientId}`, {});
  }

  updateAntecedents(patientId: number, antecedents: Antecedents) : Observable<void>{
    return this.http.put<void>(`${this.baseUrl}/${patientId}/antecedents`, antecedents);
  }

  updateExamenClinique(patientId:number, examen: ExamenClinique) : Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${patientId}/examen-clinique`,examen);
  }

   updateInfosUrgence(patientId:number, infos: InfosUrgence) : Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${patientId}/infos-urgence`,infos);
  }

  updateExamensComplementaires(patientId:number, exams: ExamensComplementaires) : Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${patientId}/examens-complementaires`,exams);
  }

  updateTraitements(patientId:number, traitements: TraitementPrescription) : Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${patientId}/traitements`, traitements);
  }

  updateDiagnosticMedical(patientId: number, diagnostic: DiagnosticMedical): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${patientId}/diagnostic`, diagnostic);
  }

  updateEvolutionSuivi(patientId: number, evolution: EvolutionSuivi): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${patientId}/evolution`, evolution);
  }

  updateCorrespondances(patientId: number, correspondances: Correspondances): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${patientId}/correspondances`, correspondances);
  }

  generateFiche(dossierId: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/fiche/${dossierId}`, {
    responseType: 'blob' // important : on reçoit un fichier binaire
  });
}

  
 
}
