import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'DOCTOR AREA',
    icon: 'ri-user-heart-line',
    isTitle: true
  },
  {
    id: 2,
    label: 'Doctor dashboard',
    icon: 'ri-dashboard-2-line',
    link: '/doctor/dashboard'
  },
  {
    id: 3,
    label: 'Medical practice',
    icon: 'ri-stethoscope-line',
    collapseid: 'doctor-medical-practice',
    isCollapsed: true,
    subItems: [
      {
        id: 4,
        label: 'Patients',
        icon: 'ri-team-line',
        link: '/doctor/patients',
        parentId: 3
      },
      {
        id: 5,
        label: 'Appointments',
        icon: 'ri-calendar-check-line',
        link: '/doctor/rendez-vous',
        parentId: 3
      },
      {
        id: 6,
        label: 'Calendar',
        icon: 'ri-calendar-line',
        link: '/doctor/agenda',
        parentId: 3
      },
      {
        id: 7,
        label: 'Consultations',
        icon: 'ri-stethoscope-line',
        link: '/doctor/consultations',
        parentId: 3
      },
      {
        id: 8,
        label: 'Medical records',
        icon: 'ri-folder-open-line',
        link: '/doctor/dossier-medical',
        parentId: 3
      },
      {
        id: 9,
        label: 'Prescriptions',
        icon: 'ri-file-text-line',
        link: '/doctor/ordonnances',
        parentId: 3
      }
    ]
  },
  {
    id: 12,
    label: 'Communication & follow-up',
    icon: 'ri-message-2-line',
    collapseid: 'doctor-communication',
    isCollapsed: true,
    subItems: [
      {
        id: 13,
        label: 'Teleconsultation',
        icon: 'ri-video-chat-line',
        link: '/doctor/teleconsultation',
        parentId: 12
      },
      {
        id: 14,
        label: 'Messaging',
        icon: 'ri-chat-3-line',
        link: '/doctor/messagerie',
        parentId: 12
      },
      {
        id: 15,
        label: 'Documents',
        icon: 'ri-folder-2-line',
        link: '/doctor/documents',
        parentId: 12
      },
      {
        id: 16,
        label: 'Chronic care',
        icon: 'ri-heart-pulse-line',
        link: '/doctor/suivi-chronique',
        parentId: 12
      },
      {
        id: 17,
        label: 'New complaint',
        icon: 'ri-file-warning-line',
        link: '/doctor/reclamations/add',
        parentId: 12
      },
      {
        id: 18,
        label: 'Complaint tracking',
        icon: 'ri-file-search-line',
        link: '/doctor/reclamations/view/1',
        parentId: 12
      }
    ]
  },
  {
    id: 19,
    label: 'Analytics & settings',
    icon: 'ri-line-chart-line',
    collapseid: 'doctor-analytics',
    isCollapsed: true,
    subItems: [
      {
        id: 20,
        label: 'AI assistance',
        icon: 'ri-robot-line',
        link: '/doctor/ia-assistance',
        parentId: 19
      },
      {
        id: 21,
        label: 'AI scheduling',
        icon: 'ri-calendar-2-line',
        link: '/doctor/ia-planning',
        parentId: 19
      },
      {
        id: 22,
        label: 'Reporting',
        icon: 'ri-bar-chart-2-line',
        link: '/doctor/reporting',
        parentId: 19
      },
      {
        id: 23,
        label: 'Billing',
        icon: 'ri-bank-card-line',
        link: '/doctor/facturation',
        parentId: 19
      },
      {
        id: 24,
        label: 'Settings',
        icon: 'ri-settings-3-line',
        link: '/doctor/parametres',
        parentId: 19
      },
      {
        id: 25,
        label: 'Profil',
        icon: 'ri-user-3-line',
        link: '/doctor/profil',
        parentId: 19
      }
    ]
  }
];
