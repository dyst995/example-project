import profileSlice, { setFullName } from '../slices/profileSlice';

describe('profileSlice', () => {
  it('sets full name', () => {
    const prevState = {
      fullName: '',
    };
    const state = profileSlice(prevState, setFullName('Nika Bero'));
    expect(state).toEqual({
      fullName: 'Nika Bero',
    });
  });
});
