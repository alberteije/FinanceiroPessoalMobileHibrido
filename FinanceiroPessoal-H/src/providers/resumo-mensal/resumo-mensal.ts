import { Injectable } from '@angular/core';
import { DatabaseProvider } from "../../providers/database/database";

@Injectable()
export class ResumoMensalProvider {

  public registros = [];

  constructor(public sqliteService: DatabaseProvider) { }

  //Seleciona todos os registros
  selectAll() {
    return new Promise(res => {
      this.registros = [];
      let query = "select * from RESUMO";
      this
        .sqliteService
        .getDb()
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .registros
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Erro na consulta SQL: selectAll - RESUMO', e);
        });
    })

  }

  //Seleciona com filtro
  selectFilter(filtro: string) {
    return new Promise(res => {
      this.registros = [];
      let query = "select * from RESUMO where " + filtro;
      this
        .sqliteService
        .getDb()
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .registros
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Erro na consulta SQL: selectFilter - RESUMO', e);
        });
    })

  }

  // Insere um registro
  addItem(resumoMensal: ResumoMensal) {
    return new Promise(resolve => {
      var query = "INSERT INTO RESUMO (MES_ANO, RECEITA_DESPESA, CODIGO, DESCRICAO, VALOR_ORCADO, VALOR_REALIZADO, DIFERENCA) VALUES (?, ?, ?, ?, ?, ?, ?)";
      var Dados = [resumoMensal.MES_ANO, resumoMensal.RECEITA_DESPESA, resumoMensal.CODIGO, resumoMensal.DESCRICAO, resumoMensal.VALOR_ORCADO, resumoMensal.VALOR_REALIZADO, resumoMensal.DIFERENCA];

      this
        .sqliteService
        .getDb()
        .executeSql(query, Dados, (r) => {
          console.log('Tudo OK. Inseriu!');
        }, e => {
          console.log('Erro na inclusão.', e);
          resolve(false);
        })
    })
  }

  // Atualiza um registro
  updateItem(resumoMensal: ResumoMensal) {
    return new Promise(resolve => {
      var query = "UPDATE RESUMO SET MES_ANO = ?, RECEITA_DESPESA = ?, CODIGO = ?, DESCRICAO = ?, VALOR_ORCADO = ?, VALOR_REALIZADO = ?, DIFERENCA = ? WHERE ID = ?";
      var Dados = [resumoMensal.MES_ANO, resumoMensal.RECEITA_DESPESA, resumoMensal.CODIGO, resumoMensal.DESCRICAO, resumoMensal.VALOR_ORCADO, resumoMensal.VALOR_REALIZADO, resumoMensal.DIFERENCA, resumoMensal.ID];
      this
        .sqliteService
        .getDb()
        .executeSql(query, Dados, (r) => {
          console.log('Tudo OK. Alterou!');
        }, e => {
          console.log('Erro na inclusão.', e);
          resolve(false);
        })
    })
  }

  // Exclui um registro
  deleteItem(id: number) {
    return new Promise(resolve => {
      var query = "DELETE FROM RESUMO WHERE ID = ?";
      var Dados = [id];
      this
        .sqliteService
        .getDb()
        .executeSql(query, Dados, (r) => {
          console.log('Tudo OK. Excluiu!');
        }, e => {
          console.log('Erro na inclusão.', e);
          resolve(false);
        })
    })
  }

  // Exclui os registros de um mês
  deleteMes(mesAno: string) {
    return new Promise(resolve => {
      var query = "DELETE FROM RESUMO WHERE MES_ANO = ?";
      var Dados = [mesAno];
      this
        .sqliteService
        .getDb()
        .executeSql(query, Dados, (r) => {
          console.log('Tudo OK. Excluiu!');
        }, e => {
          console.log('Erro na inclusão.', e);
          resolve(false);
        })
    })
  }

}

export class ResumoMensal {
  ID: number;
  MES_ANO: string;
  RECEITA_DESPESA: string;
  CODIGO: string;
  DESCRICAO: string;
  VALOR_ORCADO: number;
  VALOR_REALIZADO: number;
  DIFERENCA: number;
}
