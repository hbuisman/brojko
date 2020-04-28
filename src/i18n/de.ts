import { Translation } from '../i18n';

export const german: Translation = {
  chooseYourLanguage: 'Sprache',
  languageName: 'Deutsch',
  chooseYourVoice: 'Stimme',
  noVoiceAvailable: 'Das System unterstützt keine Stimme für diese Sprache.',
  answerIsCorrect: ['Gut gemacht!', 'Bravo!', 'Super!'],
  incorrectAnswer: [
    (got: string, expected: string) => `Du hast ${got} geschrieben, aber man sollte ${expected} schreiben.`,
    (got: string, expected: string) => `Das ist ${got}, das ist nicht ${expected}`,
  ],
};
