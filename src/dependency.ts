import { History, LocationState } from 'history';

import * as i18n from './i18n';
import * as random from './random';
import * as speech from './speech';

/**
 * Represent a bundle of global dependencies.
 */
export interface Registry {
  aRandom: random.Random;
  aSpeechSynthesis: SpeechSynthesis;
  translations: i18n.Translations;
  voices: speech.Voices;
  voicesByLanguage: speech.VoicesByLanguage;
  history: History<LocationState>;
}

export function initializeRegistry(
  aRandom: random.Random,
  aSpeechSynthesis: SpeechSynthesis,
  translations: i18n.Translations,
  history: History,
): Registry {
  const voices = new speech.Voices(aSpeechSynthesis.getVoices());

  const voicesByLanguage = speech.groupVoicesByLanguage(voices, translations.keys());

  return {
    aRandom,
    translations,
    aSpeechSynthesis: aSpeechSynthesis,
    voices,
    voicesByLanguage,
    history,
  };
}
