import * as jwt from 'jsonwebtoken';

export const verifyToken = (token: string) => jwt.verify(token, 'shhhhh');
