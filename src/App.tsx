import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './translation';
import Player from './container/Player';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Player />
    </I18nextProvider>
  );
}

export default App;
