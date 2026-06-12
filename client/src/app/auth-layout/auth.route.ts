import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Question } from '../pages/question/question';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
  },
  {
    path:'question',
    component:Question
  }
];
