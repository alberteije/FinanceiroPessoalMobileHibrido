import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()
export class DatabaseProvider {

  public db = null;

  constructor() { }

  /**
  * 
  * Abre o banco de dados
  */
  openDb() {
    this.db = window
      .sqlitePlugin
      .openDatabase({ name: 't2ti-financeiro-h.db', location: 'default' });
    this
      .db
      .transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS CONTA_RECEITA (ID integer primary key AUTOINCREMENT NOT NULL, CODIGO text, DESCRICAO text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CONTA_DESPESA (ID integer primary key AUTOINCREMENT NOT NULL, CODIGO text, DESCRICAO text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS LANCAMENTO_RECEITA (ID integer primary key AUTOINCREMENT NOT NULL, CODIGO text, MES_ANO text, DATA_RECEITA date, HISTORICO text, VALOR real, SITUACAO text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS LANCAMENTO_DESPESA (ID integer primary key AUTOINCREMENT NOT NULL, CODIGO text, MES_ANO text, DATA_RECEITA date, HISTORICO text, VALOR real, SITUACAO text)'); // OBS: observe que foi utilizada DATA_RECEITA, mas deveria ser DATA_DESPESA. Corrija isso.
        tx.executeSql('CREATE TABLE IF NOT EXISTS RESUMO (ID integer primary key AUTOINCREMENT NOT NULL, MES_ANO text, RECEITA_DESPESA text, CODIGO text, DESCRICAO text, VALOR_ORCADO real, VALOR_REALIZADO real, DIFERENCA real)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS EXTRATO_BANCO (ID integer primary key AUTOINCREMENT NOT NULL, MES_ANO text, DATA_TRANSACAO date, VALOR real, ID_TRANSACAO text, CHECKNUM text, NUMERO_REFERENCIA text, HISTORICO text, CONCILIADO integer)');
      }, (e) => {
        console.log('Erro criando as tabelas do banco de dados.', e);
      }, () => {
        console.log('Tudo OK.');
      })
  }

  /**
  * 
  * Retorna o banco de dados para quem chamou
  */
  getDb() {
    // Insere dados padrões
    this.insertContasReceita();
    this.insertContasDespesa();

    return this.db;
  }

  insertContasReceita() {
    // Primeiro verifica se existe algum registro. Caso não exista, insere os registros padrões
    return new Promise(res => {
      let query = "SELECT * FROM CONTA_RECEITA";
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length <= 0) {

            this.db.sqlBatch([
              ['insert into CONTA_RECEITA (CODIGO, DESCRICAO) values (?, ?)', ['1001', 'Saldo Anterior em Conta']],
              ['insert into CONTA_RECEITA (CODIGO, DESCRICAO) values (?, ?)', ['1002', 'Salário']],
              ['insert into CONTA_RECEITA (CODIGO, DESCRICAO) values (?, ?)', ['1003', 'Aluguéis']],
              ['insert into CONTA_RECEITA (CODIGO, DESCRICAO) values (?, ?)', ['1004', 'Outras Receitas']],
            ]);

          }

          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

  insertContasDespesa() {
    // Primeiro verifica se existe algum registro. Caso não exista, insere os registros padrões
    return new Promise(res => {
      let query = "SELECT * FROM CONTA_DESPESA";
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length <= 0) {

            this.db.sqlBatch([
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2001', 'Educação']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2002', 'Saúde']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2003', 'Alimentação']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2004', 'Moradia']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2005', 'Carro']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2006', 'Diversão']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2007', 'Doações']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2008', 'Investimentos']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2009', 'Impostos']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2010', 'Seguros']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2011', 'Viagens']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2012', 'Empréstimos']],
              ['insert into CONTA_DESPESA (CODIGO, DESCRICAO) values (?, ?)', ['2013', 'Outras Despesas']],
            ]);

          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

}
