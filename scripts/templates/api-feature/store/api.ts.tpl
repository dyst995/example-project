import type { {{Feature}} } from '../../domain/models/{{feature}}';
import { {{Feature}}Service } from '../../network/services/{{feature}}/{{feature}}.service';
import { to{{Feature}} } from '../../network/services/{{feature}}/mappers/{{feature}}.mapper';
import { normalizeApiError } from '../../network/utils/normalizeApiError';
import { baseApi } from '../api/baseApi';

export const {{feature}}Api = baseApi.injectEndpoints({
  endpoints: build => ({
    get{{Feature}}: build.query<{{Feature}}, string>({
      async queryFn(id) {
        try {
          const response = await {{Feature}}Service.get{{Feature}}(id);
          return { data: to{{Feature}}(response.data) };
        } catch (error) {
          return { error: normalizeApiError(error) };
        }
      },
      providesTags: (_result, _error, id) => [{ type: '{{Feature}}', id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGet{{Feature}}Query } = {{feature}}Api;
