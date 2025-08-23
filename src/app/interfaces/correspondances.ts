import { CompteRenduHospitalisation } from "./compte.rendu.hospitalisation";
import { CompteRenduOperatoire } from "./compte.rendu.operatoire";
import { LettreConfrere } from "./lettre.confrere";

export interface Correspondances {
    compteRenduHospitalisation?: CompteRenduHospitalisation;
    compteRenduOperatoire?: CompteRenduOperatoire;
    lettreConfrere?: LettreConfrere;
}
