import { RootState } from '..';

export const select{{Feature}}State = (state: RootState) => state.{{feature}};

export const select{{Feature}}Item = (state: RootState) => state.{{feature}}.item;

export const select{{Feature}}Loading = (state: RootState) => state.{{feature}}.isLoading;

export const select{{Feature}}Error = (state: RootState) => state.{{feature}}.error;
