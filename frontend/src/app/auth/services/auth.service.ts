import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from '@angular/fire/auth';
import { User as FirebaseUser } from 'firebase/auth';
import { environment } from '../../../../environments/environment';
import { Subscription, User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);
  private _http = inject(HttpClient);
  private _router = inject(Router);

  loading = signal<boolean>(false);
  userLogged = signal<FirebaseUser | null>(null);

  private userProfileSubject = new BehaviorSubject<User | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor() {
    // Escuchar cambios en la autenticación
    this.loading.set(true);
    this._auth.onAuthStateChanged(async (user) => {
      this.userLogged.set(user);
      this.loading.set(false);
      if (user) {
        const token = await this.getToken();
        console.log(token);
        if (token) {
          sessionStorage.setItem('token', token);
        }
        this.validateUser();
      } else {
        this.signOut();
      }
    });
  }

  // Registrar un usuario con email y contraseña
  signUp(user: { email: string; password: string }) {
    const { email, password } = user;
    return createUserWithEmailAndPassword(this._auth, email, password);
  }

  // Iniciar sesión con email y contraseña
  signIn(user: { email: string; password: string }) {
    const { email, password } = user;
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  // Cerrar sesión
  signOut() {
    sessionStorage.removeItem('token');
    this._router.navigate(['/']);
    this.userProfileSubject.next(null);
    this.userLogged.set(null);
    return firebaseSignOut(this._auth);
  }

  // Iniciar sesión con Google
  submitWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this._auth, provider);
  }

  private validateUser() {
    if (!this.userLogged()) {
      console.error('User is not logged');
      return;
    }
    const url = `${environment.apiUrl}/auth`;
    this._http.post<User>(url, {}).subscribe(
      (user) => {
        this.userProfileSubject.next(user);
        this.getSuscription(user.subscription as string);
      },
      (error) => {
        console.error('Error validating user');
        this.signOut();
      }
    );
  }

  private getSuscription(subscriptionId: string) {
    if (!subscriptionId) {
      console.error('Subscription ID is invalid');
      return;
    }

    const url = `${environment.apiUrl}/subscription/${subscriptionId}`;
    this._http.get<Subscription>(url).subscribe(
      (subscription) => {
        const userProfile = this.userProfileSubject.value;
        if (userProfile) {
          this.userProfileSubject.next({ ...userProfile, subscription });
        }
      },
      (error) => {
        console.error('Error fetching subscription:', error);
      }
    );
  }

  async getToken() {
    const user = this.userLogged();
    if (!user) return null;

    const token = sessionStorage.getItem('token') ?? (await user.getIdToken());

    return token;
  }

  get isAdmin() {
    const user = this.userProfileSubject.value;
    return user?.role === 'admin';
  }

  get userPlan() {
    const user = this.userProfileSubject.value;
    if (!user) return null;
    return typeof user?.subscription === 'object' ? user.subscription : null;
  }
}
