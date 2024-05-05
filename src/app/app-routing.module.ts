import { CallComponent } from './call/components/call/call.component';
import { ConferenceComponent } from './conference/conference.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsStudentExamCardComponent } from './details-student-exam-card/details-student-exam-card.component';
import { DetailsTeacherExamCardComponent } from './details-teacher-exam-card/details-teacher-exam-card.component';
import { LoginComponent } from './login/login.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { StudentExamComponent } from './student-exam/student-exam.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { StudentUnderExamComponent } from './student-under-exam/student-under-exam.component';
import { ChunkedTransmissionComponent } from './chunked-transmission-component/chunked-transmission-component.component';
import { TableComponent } from './table/table.component';
import { ListComponent } from './list/list.component';
import { QuestionCreationComponent } from './question-creation/question-creation.component';
import { McqExamComponent } from './mcq-exam/mcq-exam.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'userprofile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'student/exam/:id',
    component: StudentExamComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'teacher/examdetails/:id',
    component: DetailsTeacherExamCardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'student/examdetails/:id',
    component: DetailsStudentExamCardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verify',
    component: OtpVerificationComponent,
  },
  {
    path: 'teacher/examdetails/:id1/:id2',
    component: StudentUnderExamComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'call',
    component: ConferenceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'call/:id',
    component: CallComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chunk',
    component: ChunkedTransmissionComponent,
  },
  {
    path: 'table/:id',

    component: TableComponent,
  },
  {
    path: 'list/:id',
    component: ListComponent,
  },
  {
    path: 'createQuestion/:id',
    component: QuestionCreationComponent
  },
  {
    path: 'exam/appear/:id',
    component: McqExamComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
