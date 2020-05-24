import 'typeface-roboto';

import { LinearProgress } from '@material-ui/core';
import createBrowserHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import * as action from './action';
import * as app from './app';
import { App } from './components/App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Unfortunately } from './components/Unfortunately';
import * as dependency from './dependency';
import * as i18n from './i18n';
import * as random from './random';
import * as select from './select';
import * as speech from './speech';
import * as storeFactory from './storeFactory';

function Main() {
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const [deps, setDeps] = useState<dependency.Registry | undefined>(undefined);
  const [store, setStore] = useState<Store<app.State, action.Action> | undefined>(undefined);
  const [selectWithDeps, setSelectWithDeps] = useState<select.WithDeps | undefined>(undefined);

  useEffect(() => {
    console.info('Initializing...');
    speech
      .promiseReady()
      .then(() => {
        const aDeps = dependency.initializeRegistry(
          new random.Random(Math.random),
          window.speechSynthesis,
          i18n.initializeTranslations(),
          createBrowserHistory(),
        );

        const aStore = storeFactory.produce(aDeps);

        const aSelectWithDeps = new select.WithDeps(aDeps);

        setDeps(aDeps);
        setStore(aStore);
        setSelectWithDeps(aSelectWithDeps);

        setReady(true);
        console.info('Initialized successfully.');
      })
      .catch((e: Error) => {
        console.error('Failed to initialize: ' + e.toString());
        setError(e.toString());
      });
  }, []);

  if (error !== undefined) {
    return <Unfortunately error={error} />;
  } else {
    if (ready) {
      if (deps === undefined) {
        throw Error('Deps are unexpectedly undefined when ready.');
      }

      if (store === undefined) {
        throw Error('Store is unexpectedly undefined when ready.');
      }

      if (selectWithDeps === undefined) {
        throw Error('selectWithDeps is unexpectedly undefined when ready.');
      }

      return (
        <Provider store={store}>
          <select.Context.Provider value={selectWithDeps}>
            <i18n.Context.Provider value={deps.translations}>
              <App />
            </i18n.Context.Provider>
          </select.Context.Provider>
        </Provider>
      );
    } else {
      return <LinearProgress />;
    }
  }
}

render(
  <ErrorBoundary>
    <Main />
  </ErrorBoundary>,
  document.getElementById('root'),
);
