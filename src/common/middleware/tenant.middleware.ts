import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): any {
    const tenantId = req.headers['x-tenant-id'] || 'public-community';

    req.tenantId = tenantId as string;
    next();
  }
}
