import { CorrespondanceMedicale } from "./correspondance.medicale";

export interface CompteRenduOperatoire extends CorrespondanceMedicale {
    nomIntervention: string;
    indicationOperatoire: string;
    descriptionActe: string;
    conclusion: string;
    complications: string[];
}
