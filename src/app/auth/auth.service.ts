import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';

import * as firebase from 'firebase';

import Swal from 'sweetalert2';
import { firebaseMessages } from '../config/config';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  fbUser: firebase.User;

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      this.fbUser = fbUser;
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {
        // console.log(resp);
        const user: User = {
          uid: resp.user.uid,
          nombre,
          email
        };

        this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.router.navigate(['/']);
          })
          .catch(error => {
            Swal('Error en el registro', error.message, 'error');
          });

      })
      .catch(error => {
        // console.error(error);
       Swal('Error en el registro', firebaseMessages.get(error.code), 'error');
      });
  }

  loginUsuario(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(resp => {
        // console.log(resp);
        this.router.navigate(['/']);
      })
      .catch(error => {
        // console.error(error);
        Swal('Error en el login', firebaseMessages.get(error.code), 'error');
      });
  }

  logoutUsuario() {
    this.router.navigate(['/login']);

    this.afAuth.auth.signOut();
  }
}
