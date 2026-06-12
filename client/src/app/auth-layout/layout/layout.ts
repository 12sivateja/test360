import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "../../pages/login/login";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Login],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
