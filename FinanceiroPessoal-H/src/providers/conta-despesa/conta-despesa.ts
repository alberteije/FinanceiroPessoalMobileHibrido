import { Injectable } from '@angular/core';
import { DatabaseProvider } from "../../providers/database/database";

@Injectable()
export class ContaDespesaProvider {

  public registros = [];

  constructor(public sqliteService: DatabaseProvider) { }

  //Seleciona todos os registros
  selectAll() {
    return new Promise(res => {
      this.registros = [];
      let query = "select * from CONTA_DESPESA";
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
          console.log('Erro na consulta SQL: selectAll - CONTA_DESPESA', e);
        });
    })

  }

  // Insere um registro
  addItem(contaDespesa: ContaDespesa) {
    return new Promise(resolve => {
      var query = "INSERT INTO CONTA_DESPESA (CODIGO, DESCRICAO) VALUES (?, ?)";
      var Dados = [contaDespesa.CODIGO, contaDespesa.DESCRICAO];
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
  updateItem(contaDespesa: ContaDespesa) {
    return new Promise(resolve => {
      var query = "UPDATE CONTA_DESPESA SET CODIGO = ?, DESCRICAO = ? WHERE ID = ?";
      var Dados = [contaDespesa.CODIGO, contaDespesa.DESCRICAO, contaDespesa.ID];
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
      var query = "DELETE FROM CONTA_DESPESA WHERE ID = ?";
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


export class ContaDespesa {
  ID: number;
  CODIGO: string;
  DESCRICAO: string;
}
