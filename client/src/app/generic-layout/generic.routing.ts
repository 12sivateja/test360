import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Login } from '../pages/login/login';
import { Register } from '../pages/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Login,
      },
      {
        path: 'sign-up',
        component: Register,
      },
    ],
  },
];
