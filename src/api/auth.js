import { mutate, read } from './client.js';

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

export function login({ email, password }) {
  return read((db) => {
    const user = db.users.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!user || user.password !== password) {
      throw new Error('El correo o la contraseña no son correctos.');
    }
    return publicUser(user);
  });
}

export function register({ name, email, password }) {
  return mutate((db) => {
    const exists = db.users.some(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      throw new Error('Ya existe una cuenta con ese correo.');
    }
    const user = {
      id: Math.max(0, ...db.users.map((item) => item.id)) + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'client',
      avatar: name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    };
    db.users.push(user);
    return publicUser(user);
  });
}

export function getUser(id) {
  return read((db) => {
    const user = db.users.find((item) => item.id === Number(id));
    if (!user) throw new Error('Usuario no encontrado.');
    return publicUser(user);
  });
}

export function listUsers() {
  return read((db) => db.users.map(publicUser));
}
