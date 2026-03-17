import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Landing } from './pages/landing/landing';
import { Mainlayout } from './layout/mainlayout/mainlayout';
import { Home } from './pages/home/home';
import { User } from './pages/user/user';
import { Groups } from './pages/groups/groups';
import { GroupDetail } from './pages/groups/group-detail/group-detail';
import { Tickets } from './pages/tickets/tickets';
import { Perfil } from './pages/perfil/perfil';

export const routes: Routes = [
    {path: '', component:Landing},
    {path: 'login', component:Login},
    {path: 'register', component:Register},
    {path: 'landing', component:Landing},
    //Mainlayout solo contiene a sidebar
    {path: 'dashboard',
        component:Mainlayout,
        children: [
            {path: 'home', component:Home},
            { path: 'user', component:User},
            { path: 'groups', component:Groups},
            { path: 'groups/:id-group', component:GroupDetail},
            { path: 'groups/:idGroup/tickets', component:Tickets},
            {path: 'perfil', component:Perfil}

        ]
    }
];
//{path: '**', redirectTo: ''} //solo redirecciona a la carpeta raíz