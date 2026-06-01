import type { {{Feature}} } from '../../../../domain/models/{{feature}}';
import type { {{Feature}}Dto } from '../types/{{feature}}.types';

export const to{{Feature}} = (dto: {{Feature}}Dto): {{Feature}} => ({
  id: dto.id,
});
