import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TourneeOptimiseeComponent } from './tournee-optimisee/tournee-optimisee.component';
import { Calendar } from '@fullcalendar/core/index.js';
import { CalendarRendezvousComponent } from './calendar-rendezvous/calendar-rendezvous.component';
import { DossierMedicalComponent } from './dossier.medical/dossier.medical.component';
import { JitsiMeetComponent } from './jitsi-meet/jitsi-meet.component';

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
        path: 'medical-dossier',
        component: DossierMedicalComponent
    },
        {
        path: 'jitsi',
        component: JitsiMeetComponent
    }

];
