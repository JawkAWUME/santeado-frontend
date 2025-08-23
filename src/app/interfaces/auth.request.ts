export interface AuthRequest {
  email: string;
  motDePasse: string;
  role: 'PATIENT' | 'PROFESSIONNEL_SANTE' ;
}
