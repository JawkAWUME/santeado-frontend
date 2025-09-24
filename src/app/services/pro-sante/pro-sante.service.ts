import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProSante } from '../../interfaces/pro-sante';
import { RecherchePro } from '../../interfaces/recherche-pro';


@Injectable({
  providedIn: 'root'
})
export class ProSanteService {

  private apiUrlRecherche = 'http://localhost:10001/api/rendezvous/recherche'; // adapte selon ton backend
  private apiUrlPros = 'http://localhost:10001/api/pros'; // adapte selon ton backend
  constructor(private http: HttpClient) {}

  rechercherPro(criteres: RecherchePro): Observable<ProSante[]> {
    return this.http.post<ProSante[]>(this.apiUrlRecherche, criteres);
  }

  getPros(nom?: string, specialite?: string): Observable<ProSante[]> {
    let params = new HttpParams();
    if (nom) {
      params = params.set('nom', nom);
    }
    if (specialite) {
      params = params.set('specialite', specialite);
    }
   return this.http.get<{ data: ProSante[] }>(this.apiUrlPros, { params }).pipe(
    map(response => response.data ?? [])
  );
  }

  


}
