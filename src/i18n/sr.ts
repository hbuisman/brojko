import { Translation } from '../i18n';

export const serbian: Translation = {
  chooseYourLanguage: 'Jezik',
  languageName: 'Srpski',
  chooseYourVoice: 'Glas',
  noVoiceAvailable: 'Sistem ne podržava glas za ovaj jezik.',
  answerIsCorrect: ['Bravo', 'Svaka čast'],
  incorrectAnswer: [
    (got: string, expected: string) => `Ovde piše ${got}, a treba ${expected}`,
    (got: string, expected: string) => `To je ${got}, a ne ${expected}`,
    (got: string, expected: string) => `To je ${got}, to nije ${expected}`,
  ],
};
