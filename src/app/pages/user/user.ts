import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Password } from 'primeng/password';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
@Component({
  selector: 'app-user',
  imports: [CardModule, ButtonModule, DialogModule, InputGroupModule, InputGroupAddonModule, Password, DatePicker, InputNumber],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}
