export interface ProSante {
  id?: number;
  nom?: string| '';
  prenom?: string | '';
  specialite?: string | '';
  tarif?: number | 0;
  latitude?: number;
  longitude?: number;
  distanceKm?: number | 0;
}