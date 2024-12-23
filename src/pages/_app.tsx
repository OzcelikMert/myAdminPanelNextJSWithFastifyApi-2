import type { AppProps } from 'next/app';
import React from 'react';
import { LocalStorageUtil } from '@utils/localStorage.util';

import '@styles/global.scss';

import '@library/variable/array';
import '@library/variable/string';
import '@library/variable/number';
import '@library/variable/date';
import '@library/variable/math';

import ComponentApp from '@components/app';

import ComponentProviderNoSSR from '@components/providers/noSSR';
import { ThemeUtil } from '@utils/theme.util';
import ComponentProviderStoreInit from '@components/providers/storeInit';

if (typeof window !== 'undefined') {
  ThemeUtil.changeTheme(LocalStorageUtil.getTheme());
}

function App({ Component, ...rest }: AppProps) {
  return (
    <ComponentProviderNoSSR>
      <ComponentProviderStoreInit>
        <ComponentApp statusCode={rest.pageProps.statusCode}>
          <Component />
        </ComponentApp>
      </ComponentProviderStoreInit>
    </ComponentProviderNoSSR>
  );
}

export default App;
