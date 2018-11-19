import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';

import * as firebase from 'firebase';

import Swal from 'sweetalert2';
import { firebaseMessages } from '../config/config';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  fbUser: firebase.User;
  private userSubscription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      this.fbUser = fbUser;
      if (this.fbUser) {
        this.userSubscription = this.afDB.doc(`${this.fbUser.uid}/usuario`)
          .valueChanges().subscribe((usuarioObj: any) => {
            const newUser = new User(usuarioObj);
            this.store.dispatch(new SetUserAction(newUser));
          });
      } else {
        this.userSubscription.unsubscribe();
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {

    this.store.dispatch(new ActivarLoadingAction());

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
            this.store.dispatch(new DesactivarLoadingAction());
            this.router.navigate(['/']);
          })
          .catch(error => {
            this.store.dispatch(new DesactivarLoadingAction());
            Swal('Error en el registro', error.message, 'error');
          });

      })
      .catch(error => {
        // console.error(error);
        this.store.dispatch(new DesactivarLoadingAction());
       Swal('Error en el registro', firebaseMessages.get(error.code), 'error');
      });
  }

  loginUsuario(email: string, password: string) {

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(resp => {
        // console.log(resp);
        this.store.dispatch(new DesactivarLoadingAction());
        this.router.navigate(['/']);
      })
      .catch(error => {
        // console.error(error);
        this.store.dispatch(new DesactivarLoadingAction());
        Swal('Error en el login', firebaseMessages.get(error.code), 'error');
      });
  }

  logoutUsuario() {
    this.router.navigate(['/login']);

    this.afAuth.auth.signOut();
  }
}
