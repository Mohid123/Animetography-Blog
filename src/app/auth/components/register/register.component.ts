import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initResgisterForm();
  }

  initResgisterForm() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.compose([
        Validators.required,
      ])
      ],

      lastName: ['', Validators.compose([
        Validators.required,
      ])
      ],

      userName: ['', Validators.compose([
        Validators.required,
      ])
      ],

      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])
      ],

      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
      ])
      ],

      profileImage: '',
      isWriter: false
    })
  }

}
