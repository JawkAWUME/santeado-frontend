import { Paiement } from "./paiement";

export interface Facture {
  id: number;
  numero: string;
  dateEmission: string; // ISO string
  urlPdf?: string;
  paiement: Paiement;
  // Champs front ajoutés pour l’UI
  montantASolder?: number|null;
  methode?: string;
}