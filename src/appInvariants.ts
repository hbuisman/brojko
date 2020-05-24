import { Action, Dispatch, Middleware, MiddlewareAPI } from 'redux';

import * as app from './app';
import * as dependency from './dependency';
import * as speech from './speech';

export function verify(state: app.State, deps: dependency.Registry) {
  if (!deps.translations.has(state.language)) {
    throw Error(`Language in the state is not contained in the translations: ${JSON.stringify(state.language)}`);
  }

  for (const language of deps.translations.keys()) {
    if (!state.voiceByLanguage.has(language)) {
      throw Error(`Unexpectedly missing an entry in the state of voiceByLanguage for the language: ${language}`);
    }

    const voice = state.voiceByLanguage.get(language);
    if (voice !== undefined && !speech.voiceForLanguageOK(voice, language, deps.voicesByLanguage)) {
      throw Error(`The state of voiceByLanguage for the language ${language} is invalid: ${voice}`);
    }
  }

  if (state.rangeCursor < 0 || state.rangeCursor > state.rangeStates.length) {
    throw Error(`Invalid rangeCursor for the list of ${state.rangeStates.length} range state(s): ${state.rangeCursor}`);
  }

  for (const [i, rangeState] of state.rangeStates.entries()) {
    if (rangeState.questions.length !== rangeState.answers.length) {
      throw Error(
        `Mismatch between questions and answers. ` +
          `rangeState no. ${i} contains ${rangeState.questions.length} question(s) ` +
          `and ${rangeState.answers.length} answer(s).`,
      );
    }

    if (rangeState.questionCursor < 0 || rangeState.questionCursor > rangeState.questions.length) {
      throw Error(
        `Invalid question cursor for the range state no. ${i}. ` +
          `There are only ${rangeState.questions.length} question(s), but the cursor is: ${rangeState.questionCursor}`,
      );
    }

    for (const q of rangeState.questions) {
      if (Number.isNaN(q) || !Number.isInteger(q)) {
        throw Error(`Expected the question to be a string representing an integer, but got: ${q}`);
      }

      if (q < rangeState.range.minInclusive || q > rangeState.range.maxInclusive) {
        throw Error(
          `Expected the question to be in the range ` +
            `[${rangeState.range.minInclusive}, ${rangeState.range.maxInclusive}], but got: ${q}`,
        );
      }
    }
  }
}

export function create(deps: dependency.Registry) {
  const middleware: Middleware = (api: MiddlewareAPI<Dispatch, app.State>) => (next: Dispatch) => (action: Action) => {
    // Verify before dispatching
    verify(api.getState(), deps);

    const result = next(action);

    // Verify after reducing
    verify(api.getState(), deps);

    return result;
  };

  return middleware;
}
