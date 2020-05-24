import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

import * as action from './action';
import * as app from './app';
import * as effect from './effect';
import * as select from './select';

/**
 * Observe the state changes and dispatch effects based on them.
 */

export function create(): Middleware {
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  const middleware: Middleware = (api: MiddlewareAPI<Dispatch, app.State>) => (next: Dispatch) => (
    a: action.Action,
  ) => {
    const result = next(a);

    switch (a.type) {
      case action.CHANGE_ANSWER:
        // Say bravo on the correct answer.
        const state = api.getState();
        const expected = select.question(state).toString();
        const answer = select.answer(state);

        if (answer === expected) {
          api.dispatch(effect.bravo() as any);
        }
        break;
      case action.TOGGLE_PREFERENCES:
        if (!a.value) {
          api.dispatch(effect.announce() as any);
        }
        break;
    }

    return result;
  };

  return middleware;
}
