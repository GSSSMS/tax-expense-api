import { Request } from 'express';
import { UserSelect } from './users.interfaces';

export interface AuthRequest extends Request {
  user: UserSelect;
}
