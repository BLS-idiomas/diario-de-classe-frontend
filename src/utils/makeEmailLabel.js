export function makeEmailLabel({ nome, sobrenome, email }) {
  return `${nome} ${sobrenome} <${email}>`;
}
