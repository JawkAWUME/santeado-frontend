import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user: any = {};
    searchTerm: string = '';
  editMode: boolean = false;

  collapsibleItems = [
    {
      label: 'Consultations',
      icon: 'mdi-stethoscope',
      open: false,
      links: [
        { text: 'Toutes les consultations', href: '/consultations/all' },
        { text: 'Nouvelle consultation', href: '/consultations/new' },
      ],
    },
    {
      label: 'Rendez-vous',
      icon: 'mdi-calendar-check',
      open: false,
      links: [
        { text: 'Mes rendez-vous', href: '/rendez-vous/my' },
        { text: 'Planifier', href: '/rendez-vous/new' },
      ],
    },
    {
      label: 'Factures',
      icon: 'mdi-receipt',
      open: false,
      links: [
        { text: 'Toutes les factures', href: '/factures/all' },
        { text: 'Paiements en attente', href: '/factures/pending' },
      ],
    },
    {
      label: 'Paramètres',
      icon: 'mdi-cog-outline',
      open: false,
      links: [
        { text: 'Profil', href: '/profil' },
        { text: 'Sécurité', href: '/profil/security' },
      ],
    },
  ];

  stats = {
    consultations: 12,
    rendezVous: 5,
    paiements: 7,
  };

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.auth.getUser(); // récupère l’utilisateur connecté
  }

  toggleItem(item: any) {
    item.open = !item.open;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  editProfile() {
    this.editMode = true;
  }

}
