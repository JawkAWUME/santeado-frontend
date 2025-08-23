export interface ProSante {
  id?: number;
  nom?: string| '';
  specialite?: string | '';
  tarif?: number | 0;
  latitude?: number;
  longitude?: number;
  distanceKm?: number | 0;
}