import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BlurhashComponent } from 'src/@core/standalones/blurhash/blurhash.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiLoaderModule, TuiTextfieldControllerModule, TuiButtonModule } from '@taiga-ui/core';
import { TuiInputPasswordModule, TuiInputModule } from '@taiga-ui/kit';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { TuiStepperModule } from '@taiga-ui/kit';
import { TuiMarkerIconModule } from '@taiga-ui/kit';
import { EmailConfirmComponent } from './components/email-confirm/email-confirm.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPassComponent,
    EmailConfirmComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TuiLoaderModule,
    TuiInputPasswordModule,
    TuiInputModule,
    TuiStepperModule,
    TuiMarkerIconModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    BlurhashComponent
  ]
})
export class AuthModule { }
