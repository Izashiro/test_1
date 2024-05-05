import { Routes } from "@angular/router";
import { UserComponent } from "src/user/user.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./auth/auth.guard";

export const appRoutes: Routes = [
    {
        path: 'signup',
        component: SignUpComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'login',
        component: LoginComponent,
    }

];
