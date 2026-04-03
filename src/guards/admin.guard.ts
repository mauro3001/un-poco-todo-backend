import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    const adminKey = process.env.ADMIN_API_KEY;

    if (!adminKey) {
      throw new UnauthorizedException(
        'Falta configurar ADMIN_API_KEY en el backend',
      );
    }

    if (apiKey === adminKey) {
      return true;
    }

    throw new UnauthorizedException(
      'No tienes permisos de Administrador. API Key inválida.',
    );
  }
}
