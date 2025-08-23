import { Patient } from "./patient";
import { ProSante } from "./pro-sante";

export interface RendezVous {
    id?: number;
    dateHeure: string;
    statut: string;
    patient?: Patient;
    proSante?: ProSante;
}