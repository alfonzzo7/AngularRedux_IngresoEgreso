export const firebaseMessages = new Map<string, string>([
    [ 'auth/email-already-in-use', 'El email ya esta asignado a un usuario' ],
    [ 'auth/invalid-email', 'El email es invalido' ],
    [ 'auth/operation-not-allowed', 'Actualmente no se puede crear usuarios con email y contraseña' ],
    [ 'auth/weak-password', 'La contraseña no cumple los requisitos minimos de validez (al menos 6 caracteres)' ],

    [ 'auth/invalid-email', 'El email no es valido' ],
    [ 'auth/user-disabled', 'El usuario esta bloqueado, contacte con el administrador' ],
    [ 'auth/user-not-found', 'El email o la contraseña no son correctos' ],
    [ 'auth/wrong-password', 'El email o la contraseña no son correctos' ]
]);
