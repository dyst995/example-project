import { BaseService } from '../../core';
import { {{Feature}}Routes } from './routes';
import type { {{Feature}}Dto } from './types/{{feature}}.types';

class {{Feature}}ServiceClass extends BaseService {
  public get{{Feature}}(id: string) {
    return this.get<{{Feature}}Dto>(`${{Feature}}Routes.get}/${id}`);
  }
}

export const {{Feature}}Service = new {{Feature}}ServiceClass();
