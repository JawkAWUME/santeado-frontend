import { Patient } from "./patient";
import { ProSante } from "./pro-sante";

export interface PaiementRequest {
    id?: number;
    montant: number;
    patient: Patient;
    professionnel: ProSante;
    statut: string;
    methode: 'Wave' | 'Orange Money';
}