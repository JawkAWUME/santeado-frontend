import { InterventionChirurgicale } from "./intervention-chirurgicale";
import { MedicamentPrescrit } from "./medicament-prescrit";
import { SoinsParamedicaux } from "./soins-paramedicaux";

export interface TraitementPrescription {
    medicaments: MedicamentPrescrit[];
    soinsParamedicaux: SoinsParamedicaux[];
    interventions: InterventionChirurgicale[];
}
