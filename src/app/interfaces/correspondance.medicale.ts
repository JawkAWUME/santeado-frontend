import { Patient } from "./patient";
import { ProSante } from "./pro-sante";

export interface CorrespondanceMedicale {
    dateRedaction: Date;
    auteur: ProSante;
    destinataire: ProSante;
    patient: Patient;
}
