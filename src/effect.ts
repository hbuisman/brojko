import { Dispatch } from 'redux';

import * as action from './action';
import * as app from './app';
import * as dependency from './dependency';
import * as select from './select';

function speak(text: string) {
  return function (_: Dispatch, getState: () => app.State, deps: dependency.Registry): void {
    const state = getState();

    const voice = state.voiceByLanguage.get(state.language);
    if (voice === undefined) {
      return;
    }

    const u = new SpeechSynthesisUtterance();
    u.voice = deps.voices.get(voice);
    u.lang = voice.lang;
    u.text = text;
    u.volume = 1; // 0 to 1
    u.rate = 0.7; // 0.1 to 1
    u.pitch = 2; //0 to 2

    deps.aSpeechSynthesis.cancel();
    deps.aSpeechSynthesis.speak(u);
  };
}

// This function announces the current question.
export function announce() {
  return function (dispatch: (what: any) => void, getState: () => app.State, _: dependency.Registry): void {
    dispatch(speak(select.question(getState()).toString()));
  };
}

export function nextQuestion() {
  return function (dispatch: (what: any) => void, getState: () => app.State, _: dependency.Registry): void {
    const state = getState();

    const rangeState = getState().rangeStates[state.rangeCursor];

    const nextPosition = (rangeState.questionCursor + 1) % rangeState.questions.length;

    dispatch(action.changeQuestionCursor(state.rangeCursor, nextPosition));
    dispatch(action.askToRefocus());
    dispatch(announce());
  };
}

export function previousQuestion() {
  return function (dispatch: (what: any) => void, getState: () => app.State, _: dependency.Registry): void {
    const state = getState();

    const rangeState = getState().rangeStates[state.rangeCursor];

    let previousPosition = rangeState.questionCursor - 1;
    if (previousPosition < 0) {
      previousPosition = rangeState.questions.length - 1;
    }

    dispatch(action.changeQuestionCursor(state.rangeCursor, previousPosition));
    dispatch(action.askToRefocus());
    dispatch(announce());
  };
}

export function bravo() {
  return function (dispatch: (what: any) => void, getState: () => app.State, deps: dependency.Registry): void {
    const state = getState();

    const translation = deps.translations.get(state.language);
    if (translation === undefined) {
      throw Error(`No translation for the language in the state: ${state.language}`);
    }

    const questionCursor = select.questionCursor(state);
    const expected = select.question(state).toString();
    const got = select.answer(state);

    if (expected !== got) {
      throw Error(
        `Expected the answer to the question at range no. ${state.rangeCursor} ` +
          `and question no. ${questionCursor} to be correct: got ${got}, expected ${expected}`,
      );
    }

    const answerIsCorrect = deps.aRandom.choose(translation.answerIsCorrect);
    dispatch(speak(answerIsCorrect));
  };
}

export function giveFeedback() {
  return function (dispatch: (what: any) => void, getState: () => app.State, deps: dependency.Registry): void {
    const state = getState();
    const translation = deps.translations.get(state.language);
    if (translation === undefined) {
      throw Error(`No translation for the language in the state: ${state.language}`);
    }

    const expected = select.question(state).toString();
    const got = select.answer(state);

    if (got === '') {
      dispatch(announce());
    } else if (got === expected) {
      dispatch(bravo());
    } else {
      const incorrectAnswer = deps.aRandom.choose(translation.incorrectAnswer);
      dispatch(speak(incorrectAnswer(got, expected)));
    }
  };
}

export function restart(rangeIndex: number) {
  return function (dispatch: (what: any) => void, _: () => app.State, __: dependency.Registry): void {
    dispatch(action.restart(rangeIndex));
    dispatch(announce());
  };
}
