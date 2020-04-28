import { Translation } from '../i18n';

export const french: Translation = {
  chooseYourLanguage: 'Langue',
  languageName: 'Français',
  chooseYourVoice: 'Voix',
  noVoiceAvailable: 'Le logiciel ne fournit pas aucune voix pour cette langue.',
  answerIsCorrect: ['Bien joué!', 'Bravo!', 'Très bien!'],
  incorrectAnswer: [
    (got: string, expected: string) => `Tu as écrit ${got}, mais on doit écrire ${expected}.`,
    (got: string, expected: string) => `C'est ${got}, ce n'est pas ${expected}`,
  ],
};
