import { AuthRequest } from "./auth.request";

export interface RegisterRequest extends AuthRequest {
    role: 'PATIENT' | 'PROFESSIONNEL_SANTE';              
}