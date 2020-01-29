const formatDate = date => new Intl.DateTimeFormat('pl-PL').format(date);

const errors = {
  CONFIRM: field =>
    `Błędna wartość. Pole musi mieć tę samą wartość co pole ${field}.`,
  INVALID_DATA_TYPE: () => 'Niepoprawne dane.',
  INVALID_EMAIL: () => 'Niepoprawny adres email.',
  MAX_DATE: maxDate =>
    `Niepoprawna data. Maksymalna data to: ${formatDate(maxDate)}.`,
  MIN_DATE: minDate =>
    `Niepoprawna data. Minimalna data to: ${formatDate(minDate)}.`,
  MAX_LENGTH: maxLength =>
    `Za długa treść. Maksymalna dozwolona długość: ${maxLength} znaków.`,
  MIN_LENGTH: minLength =>
    `Za krótka treść. Minimalna dozwolona długość: ${minLength} znaków.`,
  NUMBER: () => 'Pole może zawierać wyłączanie cyfry.',
  POSTAL_CODE: () => 'Niepoprawny kod pocztowy. Wprowadź kod w postaci XX-XXX',
  REQUIRED: () => 'Pole wymagane.',
  STRING: () => 'Pole może zawierać wyłącznie litery.',
  STRING_OR_NUMBER: () => 'Pole może zawierać wyłącznie litery i cyfry.',
  URL: () => 'Niepoprawny url. Wprowadź poprawny adres url.',
  INVALID_VOTE: () => 'Nie można oddawać więcej niż jeden głos na post.',
};

module.exports = {
  errors,
};
