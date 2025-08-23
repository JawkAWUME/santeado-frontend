import { Patient } from "./patient";
import { ProSante } from "./pro-sante";

export interface Planification {
    patientId: number;
    medecinId:number;
    dateHeure: string;
}
