import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';

// * Декоратор на получение токена авторизации
// Описание: получение авторизационного токена
// из запроса
export const Bearer = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.headers?.authorization) {
      throw new ForbiddenException('не авторизирован');
    }

    const token = request.headers.authorization.split(' ')[1];
    if (!token) throw new ForbiddenException('не авторизирован');
    return token;
  },
);
