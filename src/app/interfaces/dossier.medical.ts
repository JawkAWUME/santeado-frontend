import { Antecedents } from "./antecedents";
import { Correspondances } from "./correspondances";
import { DiagnosticMedical } from "./diagnostic.medical";
import { DocumentMedical } from "./document.medical";
import { EvolutionSuivi } from "./evolution-suivi";
import { ExamenClinique } from "./examen.clinique";
import { ExamensComplementaires } from "./examens-complementaires";
import { HistoriqueConsultation } from "./historique.consultation";
import { Patient } from "./patient";
import { TraitementPrescription } from "./traitement-prescription";

export interface DossierMedical {
    id?: number;
    resume?: string;
    patient?: Patient;
    couvertureSociale?: string;
    personneUrgence?: string;
    telPersonneUrgence?: string;
    antecedents?: Antecedents;
    examenClinique?: ExamenClinique;
    examensComplementaires?: ExamensComplementaires;
    traitements?: TraitementPrescription;
    diagnosticMedical?: DiagnosticMedical;
    evolutionSuivi?: EvolutionSuivi;
    correspondances?: Correspondances;
    documents?: DocumentMedical[];
    documentsAnnexes?: any[];
    historiques : HistoriqueConsultation[];
    
}
