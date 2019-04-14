import { Injectable } from '@angular/core';
import { DatabaseProvider } from "../../providers/database/database";

@Injectable()
export class LancamentoReceitaProvider {

  public registros = [];

  constructor(public sqliteService: DatabaseProvider) { }

  //Seleciona todos os registros
  selectAll() {
    return new Promise(res => {
      this.registros = [];
      let query = "select * from LANCAMENTO_RECEITA";
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
          console.log('Erro na consulta SQL: selectAll - LANCAMENTO_RECEITA', e);
        });
    })

  }

  //Seleciona com filtro
  selectFilter(filtro: string) {
    return new Promise(res => {
      this.registros = [];
      let query = "select * from LANCAMENTO_RECEITA where " + filtro;
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
          console.log('Erro na consulta SQL: selectFilter - LANCAMENTO_RECEITA', e);
        });
    })

  }

  //Seleciona agrupado com as contas
  selectAgrupado(mesAno: string) {
    return new Promise(res => {
      this.registros = [];
      let query = "select L.MES_ANO, L.CODIGO, C.DESCRICAO, SUM(L.VALOR) AS VALOR FROM LANCAMENTO_RECEITA L INNER JOIN CONTA_RECEITA C ON (L.CODIGO=C.CODIGO) where L.MES_ANO = '" + mesAno + "' GROUP BY L.MES_ANO, L.CODIGO, C.DESCRICAO";
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
          console.log('Erro na consulta SQL: selectFilter - LANCAMENTO_RECEITA', e);
        });
    })

  }

  // Insere um registro
  addItem(lancamentoReceita: LancamentoReceita) {
    return new Promise(resolve => {
      var query = "INSERT INTO LANCAMENTO_RECEITA (MES_ANO, CODIGO, DATA_RECEITA, HISTORICO, VALOR, SITUACAO) VALUES (?, ?, ?, ?, ?, ?)";
      var Dados = [lancamentoReceita.MES_ANO, lancamentoReceita.CODIGO, lancamentoReceita.DATA_RECEITA, lancamentoReceita.HISTORICO, lancamentoReceita.VALOR, lancamentoReceita.SITUACAO];
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
  updateItem(lancamentoReceita: LancamentoReceita) {
    return new Promise(resolve => {
      var query = "UPDATE LANCAMENTO_RECEITA SET MES_ANO = ?, CODIGO = ?, DATA_RECEITA = ?, HISTORICO = ?, VALOR = ?, SITUACAO = ? WHERE ID = ?";
      var Dados = [lancamentoReceita.MES_ANO, lancamentoReceita.CODIGO, lancamentoReceita.DATA_RECEITA, lancamentoReceita.HISTORICO, lancamentoReceita.VALOR, lancamentoReceita.SITUACAO, lancamentoReceita.ID];
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
      var query = "DELETE FROM LANCAMENTO_RECEITA WHERE ID = ?";
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

}


export class LancamentoReceita {
  ID: number;
  MES_ANO: string;
  CODIGO: string;
  DATA_RECEITA: string;
  HISTORICO: string;
  VALOR: Number;
  SITUACAO: string;
}
