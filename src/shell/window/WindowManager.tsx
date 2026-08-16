import { useWindowStore } from '../../stores/window-store';
import { Window } from './Window';

export function WindowManager() {
  const windows = useWindowStore(state => state.windows);

  return (
    <>
      {windows.map(win => (
        <Window key={win.windowId} win={win} />
      ))}
    </>
  );
}
