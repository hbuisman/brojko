import { Translation } from '../i18n';

export const spanish: Translation = {
  chooseYourLanguage: 'Idioma',
  languageName: 'Castellano',
  chooseYourVoice: 'Voz',
  noVoiceAvailable: 'El sistema no soporta la narración en el idioma escogido.',
  answerIsCorrect: ['Muy bien!', 'Muy bien hecho!', 'Olé!'],
  incorrectAnswer: [(got: string, expected: string) => `Escribiste ${got}, pero tienes que escribir ${expected}`],
};
