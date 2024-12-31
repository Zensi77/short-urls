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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);

  userLogged = signal<FirebaseUser | null>(null);

  // Usamos un Observable que emite el usuario o null
  currentUser$ = new Observable<FirebaseUser | null>((observer) => {
    // Escuchar cambios en la autenticación
    const unsubscribe = this._auth.onAuthStateChanged((user) => {
      observer.next(user); // Emitir el usuario o null
      this.userLogged.set(user);
    });

    // Limpieza cuando se desuscriba el Observable
    return () => unsubscribe();
  });

  // Registrar un usuario con email y contraseña
  signUp(user: { email: string; password: string }) {
    const { email, password } = user;
    return createUserWithEmailAndPassword(this._auth, email, password);
  }

  // Iniciar sesión con email y contraseña
  signIn(user: { email: string; password: string }) {
    const { email, password } = user;
    return signInWithEmailAndPassword(this._auth, email, password).catch(
      (err) => console.log(err)
    );
  }

  // Cerrar sesión
  signOut() {
    return firebaseSignOut(this._auth);
  }

  // Iniciar sesión con Google
  submitWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this._auth, provider);
  }
}
