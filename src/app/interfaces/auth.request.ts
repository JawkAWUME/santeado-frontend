export interface AuthRequest {
  email: string;
  motDePasse: string;
  role: 'PATIENT' | 'PRO_SANTE' ;
}
