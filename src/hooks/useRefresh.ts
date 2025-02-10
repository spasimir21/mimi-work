import { useState } from 'react';

function useRefresh() {
  const [_, setState] = useState(false);
  return () => setState(s => !s);
}

export { useRefresh };
