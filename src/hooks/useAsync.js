import { useEffect, useState } from 'react';

export function useAsync(loader, deps = []) {
  const [state, setState] = useState({
    status: 'loading',
    data: null,
    error: null
  });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, status: 'loading', error: null }));

    loader()
      .then((data) => {
        if (active) setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        if (active) setState({ status: 'error', data: null, error: error.message });
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  return { ...state, reload: () => setVersion((value) => value + 1) };
}
