import { Patient } from "./patient";
import { ProSante } from "./pro-sante";

export interface Paiement {
  id: number;
  montant: number;
  datePaiement: string; // ISO string
  patient: Patient;
  professionnel: ProSante;
  methode: string; // "Wave" | "Orange Money" | "Carte"
  statut: string;  // "SUCCES" | "ECHEC" | "EN_ATTENTE" | "PARTIEL"
}

