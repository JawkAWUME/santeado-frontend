import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TourneeOptimiseeComponent } from './tournee-optimisee/tournee-optimisee.component';
import { CalendarRendezvousComponent } from './calendar-rendezvous/calendar-rendezvous.component';
import { DossierMedicalComponent } from './dossier.medical/dossier.medical.component';
import { JitsiMeetComponent } from './jitsi-meet/jitsi-meet.component';
import { DossierHistorique } from './dossier-historique/dossier-historique';
import { DossierDetail } from './dossier-detail/dossier-detail';
import { PaiementComponent } from './paiement.component/paiement.component';

export const routes: Routes = [
    {
        path: 'login',
        component:LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'tournee-optimisee',
        component: TourneeOptimiseeComponent
    },
    {
        path: 'rdv',
        component: CalendarRendezvousComponent
    },
    {
        path: 'medical-dossier/:id',
        component: DossierMedicalComponent
    },
        {
        path: 'jitsi',
        component: JitsiMeetComponent
    },
    { path: 'dossiers-historique', component: DossierHistorique },
    { path: 'dossier/:id', component: DossierDetail },
    { path: 'paiement/:id', component: PaiementComponent },
    //   { path: '', redirectTo: '/dossiers-historique', pathMatch: 'full' },

];
