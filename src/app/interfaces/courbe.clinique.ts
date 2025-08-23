import { MesureClinique } from "./mesure.clinique";

export interface CourbeClinique {
    type: string; // Type de la courbe (ex: poids, tension artérielle, etc.)
    mesures: MesureClinique[]; // Liste des mesures cliniques associées à
}