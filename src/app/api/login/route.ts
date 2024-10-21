import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const users = [
  {
    email: 'jesus@numengames.com',
    password: '$2b$12$iZmNV/OVLFoEqqW/aP2IT.OtiWpdP..YM75NsU/p9OkVWaN5jE1uu'
  },
  {
    email: 'pablofm@numengames.com',
    password: '$2b$12$iZmNV/OVLFoEqqW/aP2IT.OtiWpdP..YM75NsU/p9OkVWaN5jE1uu'
  },
  {
    email: 'christianmartens@numengames.com',
    password: '$2b$12$iZmNV/OVLFoEqqW/aP2IT.OtiWpdP..YM75NsU/p9OkVWaN5jE1uu'
  }
];

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