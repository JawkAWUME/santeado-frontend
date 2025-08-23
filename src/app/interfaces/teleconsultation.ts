import { Patient } from "./patient";
import { ProSante } from "./pro-sante";

export interface Teleconsultation {
    id: number;
    dateHeure: string;
    statut: string;
    lienVideo: string;
    patient: Patient;
    proSante: ProSante
}