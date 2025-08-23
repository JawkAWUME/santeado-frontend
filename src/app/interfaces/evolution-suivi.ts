import { ConsultationSuivi } from "./consultation.suivi";
import { CourbeClinique } from "./courbe.clinique";

export interface EvolutionSuivi {
    notesEvolution: string[];
    courbes: CourbeClinique[];
    consultations: ConsultationSuivi[];
}
