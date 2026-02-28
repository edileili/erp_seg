import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Landing } from './pages/landing/landing';
import { Mainlayout } from './layout/mainlayout/mainlayout';
import { Home } from './pages/home/home';
import { User } from './pages/user/user';
import { Groups } from './pages/groups/groups';

export const routes: Routes = [
    {path: '', component:Landing},
    {path: 'login', component:Login},
    {path: 'register', component:Register},
    {path: 'landing', component:Landing},
    //Mainlayout solo contiene a sidebar
    {path: '',
        component:Mainlayout,
        children: [
            {path: 'home', component:Home,
                children: [
                    { path: 'user', component:User},
                    { path: 'groups', component:Groups}
                ]
            }
        ]
    }
    //{path: '**', redirectTo: ''} //solo redirecciona a la carpeta raíz
];
