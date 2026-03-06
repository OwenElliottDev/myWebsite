import { selectIsCLI, setIsCLI } from '@/store/homepageSlice';
import { setDirBiscuitCrumbs, selectBiscuitCrumbs } from '@/store/commandlineSlice';
import { routeToDirectory, directoryToRoute } from '@/commandLogic/mockFileSystem';
import { FiTerminal, FiMonitor } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const UISwitch = () => {
  const isCLI = useSelector(selectIsCLI);
  const dirBiscuitCrumbs = useSelector(selectBiscuitCrumbs);
  const dispatch = useDispatch();
  const router = useRouter();

  function toggle() {
    const goingToCLI = !isCLI;
    if (goingToCLI) {
      const crumbs = routeToDirectory[router.pathname] || [''];
      dispatch(setDirBiscuitCrumbs(crumbs));
      if (router.pathname !== '/') {
        router.push('/');
      }
    } else {
      const lastCrumb = dirBiscuitCrumbs[dirBiscuitCrumbs.length - 1];
      const route = directoryToRoute[lastCrumb] || '/';
      router.push(route);
    }
    dispatch(setIsCLI(goingToCLI));
  }

  return (
    <div className={`ui-switch-container`} onClick={toggle}>
      <div>Switch to {`${isCLI ? 'GUI' : 'CLI'}`}</div>
      <div className="ui-switch">
        <div className={`icon-container ${isCLI ? 'active' : ''}`}>
          <div className={`icon ${isCLI ? 'active' : ''}`}>
            {isCLI ? <FiMonitor /> : <FiTerminal />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UISwitch;
