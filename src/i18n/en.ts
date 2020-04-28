import { Translation } from '../i18n';

export const english: Translation = {
  chooseYourLanguage: 'Language',
  languageName: 'English',
  chooseYourVoice: 'Voice',
  noVoiceAvailable: 'Your system does not provide a voice for this language.',
  answerIsCorrect: ['Good job!', 'Well done!', 'Great!'],
  incorrectAnswer: [(got: string, expected: string) => `You wrote ${got}, but you need to write ${expected}`],
};
