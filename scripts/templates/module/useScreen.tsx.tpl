import { select{{Feature}}Error, select{{Feature}}Loading } from '../../../store/{{feature}}';
import { useAppSelector } from '../../../store/hooks';

export const use{{Feature}}Screen = () => {
  const isLoading = useAppSelector(select{{Feature}}Loading);
  const error = useAppSelector(select{{Feature}}Error);

  return {
    isLoading,
    error,
  };
};
