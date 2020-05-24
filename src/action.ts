import * as i18n from './i18n';
import * as speech from './speech';

export const CHANGE_ANSWER = 'CHANGE_ANSWER';

interface ChangeAnswer {
  type: typeof CHANGE_ANSWER;
  rangeIndex: number;
  questionIndex: number;
  text: string;
}

export function changeAnswer(rangeIndex: number, questionIndex: number, text: string): Action {
  return { type: CHANGE_ANSWER, rangeIndex, questionIndex, text };
}

export const CHANGE_QUESTION_CURSOR = 'CHANGE_QUESTION_CURSOR';

interface ChangeQuestionCursor {
  type: typeof CHANGE_QUESTION_CURSOR;
  rangeIndex: number;
  questionIndex: number;
}

export function changeQuestionCursor(rangeIndex: number, questionIndex: number): Action {
  return { type: CHANGE_QUESTION_CURSOR, rangeIndex, questionIndex };
}

export const CHANGE_RANGE_CURSOR = 'CHANGE_RANGE_CURSOR';

interface ChangeRangeCursor {
  type: typeof CHANGE_RANGE_CURSOR;
  index: number;
}

export function changeRangeCursor(index: number): Action {
  return { type: CHANGE_RANGE_CURSOR, index };
}

export const ASK_TO_REFOCUS = 'ASK_TO_REFOCUS';

interface AskToRefocus {
  type: typeof ASK_TO_REFOCUS;
}

export function askToRefocus(): Action {
  return { type: ASK_TO_REFOCUS };
}

export const ACK_REFOCUS = 'ACK_REFOCUS';

interface AckRefocus {
  type: typeof ACK_REFOCUS;
}

export function ackRefocus(): Action {
  return { type: ACK_REFOCUS };
}

export const TOGGLE_PREFERENCES = 'TOGGLE_PREFERENCES';

interface TogglePreferences {
  type: typeof TOGGLE_PREFERENCES;
  value: boolean;
}

export function togglePreferences(value: boolean): Action {
  return { type: TOGGLE_PREFERENCES, value: value };
}

export const CHANGE_TRANSLATION = 'CHANGE_TRANSLATION';

interface ChangeTranslation {
  type: typeof CHANGE_TRANSLATION;
  language: i18n.LanguageID;
}

export function changeTranslation(language: i18n.LanguageID): Action {
  return { type: CHANGE_TRANSLATION, language };
}

export const CHANGE_VOICE = 'CHANGE_VOICE';

interface ChangeVoice {
  type: typeof CHANGE_VOICE;
  language: i18n.LanguageID;
  voice: speech.VoiceID | undefined;
}

export function changeVoice(language: i18n.LanguageID, voice: speech.VoiceID | undefined): Action {
  return { type: CHANGE_VOICE, language, voice };
}

export const RESTART = 'RESTART';

interface Restart {
  type: typeof RESTART;
  rangeIndex: number;
}

export function restart(rangeIndex: number): Action {
  return { type: RESTART, rangeIndex };
}

export type Action =
  | ChangeAnswer
  | ChangeQuestionCursor
  | ChangeRangeCursor
  | AskToRefocus
  | AckRefocus
  | TogglePreferences
  | ChangeTranslation
  | ChangeVoice
  | Restart;
