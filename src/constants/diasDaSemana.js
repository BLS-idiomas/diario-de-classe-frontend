export const DIAS_ARRAY = [
  'SEGUNDA',
  'TERCA',
  'QUARTA',
  'QUINTA',
  'SEXTA',
  'SABADO',
  'DOMINGO',
];

export const DIAS_LABEL = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
};

// Reverse mapping from label to constant key
const DIAS_LABEL_TO_KEY = Object.entries(DIAS_LABEL).reduce(
  (acc, [key, label]) => {
    acc[label] = key;
    return acc;
  },
  {}
);

export const getDiaConstantFromLabel = label => {
  return DIAS_LABEL_TO_KEY[label] || label;
};
