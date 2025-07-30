import { Component, OnInit } from '@angular/core';
import { Avisocookies } from "../avisocookies/avisocookies";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.html',
  styleUrls: ['./cookies.css'],
  imports: [ RouterModule],
})
export class Cookies implements OnInit {

cookiesVisible = false;
  ngOnInit(): void {
    this.cookiesVisible = true;
    this.verificarConsentimientoPrevio();
  }

private verificarConsentimientoPrevio(): void {
    // Verificar si el usuario ya dio su consentimiento anteriormente
    const consentimiento = localStorage.getItem('cookies-consent');

        if (!consentimiento) {
      // Si no hay consentimiento previo, mostrar el aviso
      this.cookiesVisible = true;
    } else {
      // Si ya hay consentimiento, no mostrar el aviso
      this.cookiesVisible = false;
    }
}

  public Rechazar() {
    localStorage.setItem('cookies-consent', 'rejected');
    localStorage.setItem('cookies-consent-date', new Date().toISOString());
    this.Aviso();
  }

  public Aceptar() {
    localStorage.setItem('cookies-consent', 'accepted');
    localStorage.setItem('cookies-consent-date', new Date().toISOString());
    this.Aviso();
  }

  public Aviso() {
    this.cookiesVisible = false;
  }
}

