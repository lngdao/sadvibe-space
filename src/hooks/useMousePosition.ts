import { useEffect, useState } from 'react';
import { fromEvent } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';

type TParamList = {
  throttleTimeTrigger?: number;
};

export function useMousePosition({ throttleTimeTrigger = 10 }: TParamList) {
  const [clientX, setClientX] = useState<number>(0);

  useEffect(() => {
    const sub = fromEvent(document, 'mousemove')
      .pipe(
        throttleTime(throttleTimeTrigger),
        map((event: any) => [event.clientX])
      )
      .subscribe(([newClientX]) => {
        setClientX(newClientX);
      });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return {
    mouseX: clientX,
  };
}
