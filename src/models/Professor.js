export class Professor {
  constructor({
    id,
    nome,
    sobrenome,
    email,
    telefone,
    senha,
    resetarSenha,
    permissao,
    dataCriacao,
    dataAtualizacao,
  }) {
    this.id = id || null;
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.email = email;
    this.telefone = telefone || null;
    this.senha = senha || null;
    this.resetarSenha = resetarSenha;
    this.permissao = permissao;
    this.dataCriacao = dataCriacao || null;
    this.dataAtualizacao = dataAtualizacao || null;
  }

  nomeCompleto() {
    return `${this.nome} ${this.sobrenome}`;
  }
}
