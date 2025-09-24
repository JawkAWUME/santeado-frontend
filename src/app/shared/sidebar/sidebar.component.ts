import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  user: any = {};
  
  collapsibleItems = [
    {
      label: 'UI Elements',
      icon: 'mdi-crosshairs-gps',
      open: false,
      links: [
        { text: 'Buttons', href: '/ui/buttons' },
        { text: 'Dropdowns', href: '/ui/dropdowns' },
        { text: 'Typography', href: '/ui/typography' },
      ],
    },
    {
      label: 'Icons',
      icon: 'mdi-contacts',
      open: false,
      links: [{ text: 'Font Awesome', href: '/icons/font-awesome' }],
    },
    {
      label: 'Forms',
      icon: 'mdi-format-list-bulleted',
      open: false,
      links: [{ text: 'Form Elements', href: '/forms/basic' }],
    },
    {
      label: 'Charts',
      icon: 'mdi-chart-bar',
      open: false,
      links: [{ text: 'ChartJs', href: '/charts/chartjs' }],
    },
    {
      label: 'Tables',
      icon: 'mdi-table-large',
      open: false,
      links: [{ text: 'Basic Table', href: '/tables/basic' }],
    },
    {
      label: 'User Pages',
      icon: 'mdi-lock',
      open: false,
      links: [
        { text: 'Blank Page', href: '/pages/blank' },
        { text: 'Login', href: '/auth/login' },
        { text: 'Register', href: '/auth/register' },
        { text: '404', href: '/error/404' },
        { text: '500', href: '/error/500' },
      ],
    },
  ];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.getUser(); // ✅ récupère l’utilisateur connecté
  }
}
