import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CountryCallingCode {
  name: string;
  code: string;         // ex: '+33'
  countryCode: string;  // ex: 'FR' (ISO 2 lettres)
}

@Injectable({
  providedIn: 'root'
})
export class PhoneRegexService {

  constructor(private http: HttpClient) {}

  // Récupérer la liste des pays + indicatifs + code pays ISO
  getCountryCallingCodes(): Observable<CountryCallingCode[]> {
    return this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,idd,cca2').pipe(
      map(countries => countries.flatMap(country => {
        const name = country.name?.common;
        const root = country.idd?.root;
        const suffixes = country.idd?.suffixes || [];
        const cca2 = country.cca2;
        return suffixes.map((s: string) => ({
          name,
          code: `${root}${s}`,
          countryCode: cca2
        }));
      }).filter(item => item.code && item.name && item.countryCode)
        .sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }

  // Validation avec libphonenumber-js selon code pays ISO
  isValidPhoneNumber(phone: string, countryCode: string | undefined): boolean {
    if (!countryCode) return false;
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode as any);
    return phoneNumber?.isValid() ?? false;
  }

}
