import { ElementBilanPhysique } from "./element.bilan.physique";

export interface ExamenClinique {
    poids?: number;
    taille?: number;
    tensionArterielle?: string;
    temperature?: number;
    frequenceCardiaque?: number;
    saturationOxygene?: number;
    bilanPhysique?: Map<string, string>;
    observations?: string[];
}
