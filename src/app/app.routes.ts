import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Landing } from './pages/landing/landing';
import { App } from './app';

export const routes: Routes = [
    {path: '', component:App},
    {path: 'login', component:Login},
    {path: 'register', component:Register},
    {path: 'landing', component:Landing},
    //{path: '**', redirectTo: ''} //solo redirecciona a la carpeta raíz
];
