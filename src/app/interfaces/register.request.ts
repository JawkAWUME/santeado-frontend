import { AuthRequest } from "./auth.request";

export interface RegisterRequest extends AuthRequest {
  role: 'PATIENT' | 'PRO_SANTE';   
  nom: string;
  prenom: string;
  sexe: string;
  adresse?: string;
  telephone?: string;

  // Champs spécifiques Patient
  lieuNaissance?: string;
  dateNaissance?: string; // ISO string ou "YYYY-MM-DD"
  situationFamiliale?: string;

  // Champs spécifiques ProSante
  specialite?: string;
  description?: string;
  tarif?: number;           
}