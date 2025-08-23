import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface IcdCode {
  code: string;
  title: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class IcdService {
  constructor(private http: HttpClient) {}

  // ✅ ICD-11 ClinicalTables
  searchICD11Codes(query: string): Observable<IcdCode[]> {
    return this.http.get<any>('https://clinicaltables.nlm.nih.gov/api/icd11_codes/v3/search', {
      params: {
        terms: query,
        sf: 'code,title,description',
        maxList: 10,
        version: '2025-01' // optionnel, version la plus récente
      }
    }).pipe(
      map((resp: any) => {
        const rows = resp[3] || [];
        return rows.map((row: any[]) => ({
          code: row[0],
          title: row[1],
          description: row[2]
        }));
      })
    );
  }

  // ✅ ICD-10 ClinicalTables
  searchICD10Codes(query: string): Observable<IcdCode[]> {
    return this.http.get<any>('https://clinicaltables.nlm.nih.gov/api/icd10cm_codes/v3/search', {
      params: {
        terms: query,
        sf: 'code,title,description',
        maxList: 10
      }
    }).pipe(
      map((resp: any) => {
        const rows = resp[3] || [];
        return rows.map((row: any[]) => ({
          code: row[0],
          title: row[1],
          description: row[2]
        }));
      })
    );
  }
}
