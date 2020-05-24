import { Translation } from '../i18n';

export const bosnian: Translation = {
  chooseYourLanguage: 'Jezik',
  languageName: 'Bosanski',
  chooseYourVoice: 'Glas',
  noVoiceAvailable: 'Sistem ne podržava glas za ovaj jezik.',
  answerIsCorrect: ['Bravo', 'Svaka čast'],
  incorrectAnswer: [
    (got: string, expected: string) => `Ovdje piše ${got}, a treba ${expected}`,
    (got: string, expected: string) => `To je ${got}, a ne ${expected}`,
    (got: string, expected: string) => `To je ${got}, to nije ${expected}`,
  ],
};
