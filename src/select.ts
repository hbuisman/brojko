import * as React from 'react';

import * as app from './app';
import * as dependency from './dependency';
import * as i18n from './i18n';
import * as speech from './speech';

export function answer(state: app.State): string {
  const rangeState = state.rangeStates[state.rangeCursor];
  return rangeState.answers[rangeState.questionCursor];
}

export function hits(state: app.State): Array<boolean> {
  const rangeState = state.rangeStates[state.rangeCursor];

  return rangeState.questions.map((q, i) => q.toString() === rangeState.answers[i]);
}

export function questionCursor(state: app.State): number {
  return state.rangeStates[state.rangeCursor].questionCursor;
}

export function question(state: app.State): number {
  const rangeState = state.rangeStates[state.rangeCursor];
  return rangeState.questions[rangeState.questionCursor];
}

export function rangeCursor(state: app.State): number {
  return state.rangeCursor;
}

export class WithDeps {
  constructor(private deps: dependency.Registry) {}

  public resolveTranslation(state: app.State): i18n.Translation {
    const translation = this.deps.translations.get(state.language);
    if (translation === undefined) {
      throw Error(`The translation in the state could not be found in the translations: ${state.language}`);
    }
    return translation;
  }

  public availableVoices(state: app.State): Array<speech.VoiceID> {
    const r = this.deps.voicesByLanguage.get(state.language);
    if (r === undefined) {
      throw Error(`Current language does not match any in voices grouped by translation: ${state.language}`);
    }

    return r;
  }
}

export const Context = React.createContext<WithDeps | undefined>(undefined);
