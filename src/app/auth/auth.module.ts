import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BlurhashComponent } from 'src/@core/standalones/blurhash/blurhash.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiLoaderModule, TuiTextfieldControllerModule, TuiButtonModule } from '@taiga-ui/core';
import {TuiInputPasswordModule, TuiInputModule} from '@taiga-ui/kit';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TuiLoaderModule,
    TuiInputPasswordModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    BlurhashComponent
  ]
})
export class AuthModule { }
