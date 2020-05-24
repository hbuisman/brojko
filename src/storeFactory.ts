import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import * as app from './app';
import * as appInvariants from './appInvariants';
import * as dependency from './dependency';
import * as observer from './observer';
import * as urlware from './urlware';

export function produce(deps: dependency.Registry) {
  const store = createStore(
    app.createReducer(deps),
    applyMiddleware(
      appInvariants.create(deps),
      thunk.withExtraArgument(deps),
      observer.create(),
      urlware.create(deps.history),
    ),
  );

  urlware.connectDispatch(deps.history, (a) => store.dispatch(a), deps.translations);

  return store;
}
