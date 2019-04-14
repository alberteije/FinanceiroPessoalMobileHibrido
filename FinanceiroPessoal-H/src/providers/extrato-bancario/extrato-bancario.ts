import { Injectable } from '@angular/core';
import { DatabaseProvider } from "../../providers/database/database";

@Injectable()
export class ExtratoBancarioProvider {

  public registros = [];

  constructor(public sqliteService: DatabaseProvider) { }

  //Seleciona todos os registros
  selectAll() {
    return new Promise(res => {
      this.registros = [];
      let query = "select * from EXTRATO_BANCO";
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
          console.log('Erro na consulta SQL: selectAll - EXTRATO_BANCO', e);
        });
    })

  }

  //Seleciona com filtro
  selectFilter(filtro: string) {
    return new Promise(res => {
      this.registros = [];
      let query = "select * from EXTRATO_BANCO where " + filtro;
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
          console.log('Erro na consulta SQL: selectFilter - EXTRATO_BANCO', e);
        });
    })

  }

  // Insere um registro
  addItem(extratoBanco: ExtratoBanco) {
    return new Promise(resolve => {
      var query = "INSERT INTO EXTRATO_BANCO (MES_ANO, DATA_TRANSACAO, VALOR, ID_TRANSACAO, CHECKNUM, NUMERO_REFERENCIA, HISTORICO, CONCILIADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      var Dados = [extratoBanco.MES_ANO, extratoBanco.DATA_TRANSACAO, extratoBanco.VALOR, extratoBanco.ID_TRANSACAO, extratoBanco.CHECKNUM, extratoBanco.NUMERO_REFERENCIA, extratoBanco.HISTORICO, extratoBanco.CONCILIADO];
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
  updateItem(extratoBanco: ExtratoBanco) {
    return new Promise(resolve => {
      var query = "UPDATE EXTRATO_BANCO SET MES_ANO = ?, DATA_TRANSACAO = ?, VALOR = ?, ID_TRANSACAO = ?, CHECKNUM = ?, NUMERO_REFERENCIA = ?, HISTORICO = ?, CONCILIADO = ? WHERE ID = ?";
      var Dados = [extratoBanco.MES_ANO, extratoBanco.DATA_TRANSACAO, extratoBanco.VALOR, extratoBanco.ID_TRANSACAO, extratoBanco.CHECKNUM, extratoBanco.NUMERO_REFERENCIA, extratoBanco.HISTORICO, extratoBanco.CONCILIADO, extratoBanco.ID];
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
      var query = "DELETE FROM EXTRATO_BANCO WHERE ID = ?";
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
      var query = "DELETE FROM EXTRATO_BANCO WHERE MES_ANO = ?";
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

export class ExtratoBanco {
  ID: number;
  MES_ANO: string;
  DATA_TRANSACAO: string;
  VALOR: Number;
  ID_TRANSACAO: string;
  CHECKNUM: string;
  NUMERO_REFERENCIA: string;
  HISTORICO: string;
  CONCILIADO: string;
}
