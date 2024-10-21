import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Función para obtener usuarios de las variables de entorno
function getUsersFromEnv() {
  const users: { email: string; password: string }[] = [];
  const userEnv = process.env.USERS || '';
  const userEntries = userEnv.split(';');

  userEntries.forEach(entry => {
    const [email, password] = entry.split(',');
    if (email && password) {
      users.push({ email, password });
    }
  });

  return users;
}

const users = getUsersFromEnv();
const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = users.find(user => user.email === email);

  if (!user) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '10m' });

  const response = NextResponse.json({ message: 'Login exitoso' });
  response.headers.set(
    'Set-Cookie',
    cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/'
    })
  );

  return response;
}