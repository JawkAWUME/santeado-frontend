import { CorrespondanceMedicale } from "./correspondance.medicale";

export interface CompteRenduHospitalisation extends CorrespondanceMedicale {
    dateAdmission?: Date;
    dateSortie?: Date;
    diagnosticAdmission?: string[];
    diagnosticSortie?: string[];
    examensEffectues?: string[];
    traitements?: string[];
    evolutions?: string[];
    recommandationsSortie?: string[];
    
}
