import { createQueryString } from '../createQueryString';

describe('createQueryString', () => {
  it('serializes values', () => {
    const query = createQueryString({
      page: 1,
      active: true,
      search: 'name',
    });

    expect(query).toBe('page=1&active=true&search=name');
  });

  it('skips undefined and null', () => {
    const query = createQueryString({
      page: 1,
      empty: undefined,
      nothing: null,
    });

    expect(query).toBe('page=1');
  });
});
