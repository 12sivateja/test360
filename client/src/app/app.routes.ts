import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./generic-layout/generic-layout-module').then((m) => m.GenericLayoutModule),
  },
  {
    path: '',
    loadChildren: () => import('./auth-layout/auth-layout-module').then((m) => m.AuthLayoutModule),
  },
];
