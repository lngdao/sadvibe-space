import React from 'react';

export const useEventListener = (
  type: string,
  handler: any,
  el: any = window
) => {
  const savedHandler = React.useRef<any>();

  React.useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    const listener = (e: any) => savedHandler.current(e);

    el.addEventListener(type, listener);

    return () => {
      el.removeEventListener(type, listener);
    };
  }, [type, el]);
};
