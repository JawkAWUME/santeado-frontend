import { CorrespondanceMedicale } from "./correspondance.medicale";

export interface LettreConfrere extends CorrespondanceMedicale {
    motifConsultation: string;
    resultatsExamens: string[];
    diagnostic: string;
    traitementsProposes: string[];
    recommandationsSuivi: string[];
}
