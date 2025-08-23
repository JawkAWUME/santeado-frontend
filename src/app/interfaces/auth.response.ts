export interface AuthResponse {
    token: string;
    role: 'PATIENT' | 'PROFESSIONNEL_SANTE';
}