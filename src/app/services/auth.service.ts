// src/app/services/auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';

// Import AUTH_CONFIG, Auth0Cordova, and auth0.js
import { AUTH_CONFIG } from './auth.config';
import * as auth0 from 'auth0-js';

declare let cordova: any;

@Injectable()
export class AuthService {
  usuario: Credenciales = {};
  constructor(
    public zone: NgZone,
    private storage: Storage
  ) {
  }

  cargarUsuario(
    nombre: string,
    email: string,
    imagen: string,
    uid: string,
    provider: string
  ) {
    this.usuario.nombre = nombre;
    this.usuario.email = email;
    this.usuario.imagen = imagen;
    this.usuario.uid = uid;
    this.usuario.provider = provider;
  }
}

export interface Credenciales {
  nombre?: string; 
  email?: string; 
  imagen?: string;
  uid?: string;
  provider?: string;
}
