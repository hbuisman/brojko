import { enableMapSet, produce } from 'immer';

import * as action from './action';
import * as appInvariants from './appInvariants';
import * as dependency from './dependency';
import * as i18n from './i18n';
import * as question from './question';
import * as range from './range';
import * as speech from './speech';

enableMapSet(); //  See https://immerjs.github.io/immer/docs/installation#pick-your-immer-version

/**
 * Part of the state concerning the individual ranges.
 */
export interface RangeState {
  readonly range: range.Range;
  questions: Array<number>;
  answers: Array<string>;
  questionCursor: number;
}

export interface State {
  readonly language: i18n.LanguageID;
  readonly voiceByLanguage: Map<i18n.LanguageID, speech.VoiceID | undefined>;
  readonly focusPending: boolean;
  readonly preferencesVisible: boolean;
  readonly rangeStates: RangeState[];
  readonly rangeCursor: number;
}

export function initializeState(deps: dependency.Registry): State {
  if (deps.translations.size === 0) {
    throw Error('Unexpected empty translations.');
  }

  const language = i18n.inferDefault(navigator.language || '', [...deps.translations.keys()].sort());

  const voiceByLanguage = new Map<i18n.LanguageID, speech.VoiceID | undefined>();
  for (const [lang, voices] of deps.voicesByLanguage.entries()) {
    if (voices.length > 0) {
      voiceByLanguage.set(lang, voices[0]);
    } else {
      voiceByLanguage.set(lang, undefined);
    }
  }

  const rangeStates: RangeState[] = range.LIST.map((r: range.Range) => {
    const questions = question.generateBank(deps.aRandom, r.minInclusive, r.maxInclusive);
    const answers = questions.map(() => '');

    return {
      range: r,
      questions,
      answers,
      questionCursor: 0,
    };
  });

  const defaultState: State = {
    language,
    voiceByLanguage,
    focusPending: true,
    preferencesVisible: true,
    rangeStates,
    rangeCursor: 0,
  };

  appInvariants.verify(defaultState, deps);

  return defaultState;
}

export function createReducer(deps: dependency.Registry) {
  const initialState = initializeState(deps);

  const reducer = (state: State = initialState, a: action.Action): State => {
    const result = produce(state, (draft) => {
      switch (a.type) {
        case action.CHANGE_ANSWER:
          draft.rangeStates[a.rangeIndex].answers[a.questionIndex] = a.text;
          break;
        case action.CHANGE_QUESTION_CURSOR:
          draft.rangeStates[a.rangeIndex].questionCursor = a.questionIndex;
          break;
        case action.CHANGE_RANGE_CURSOR:
          draft.rangeCursor = a.index;
          break;
        case action.ASK_TO_REFOCUS:
          draft.focusPending = true;
          break;
        case action.ACK_REFOCUS:
          draft.focusPending = false;
          break;
        case action.TOGGLE_PREFERENCES:
          draft.preferencesVisible = a.value;
          break;
        case action.CHANGE_TRANSLATION:
          draft.language = a.language;
          break;
        case action.CHANGE_VOICE:
          draft.voiceByLanguage.set(a.language, a.voice);
          break;
        case action.RESTART:
          const r = state.rangeStates[a.rangeIndex].range;

          const questions = question.generateBank(deps.aRandom, r.minInclusive, r.maxInclusive);

          const answers = questions.map(() => '');

          draft.rangeStates[a.rangeIndex].questionCursor = 0;
          draft.rangeStates[a.rangeIndex].questions = questions;
          draft.rangeStates[a.rangeIndex].answers = answers;
      }
    });

    return result;
  };

  return reducer;
}
