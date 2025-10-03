import { AnalyseBiologique } from './analyse.biologique';
import { TestSpecial } from './test.special';
export interface ExamensComplementaires {
    analysesSanguines?: Map<string, string>[];
    analysesUrines?: Map<string, string>[];
    radiographies?: string[];
    echographies?: string[];
    irm?: string[];
    scanners?: string[];
    testsSpeciaux: Map<string, string>[];
}
