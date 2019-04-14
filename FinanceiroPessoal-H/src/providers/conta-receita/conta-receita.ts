import { Injectable } from '@angular/core';
import { DatabaseProvider } from "../../providers/database/database";

@Injectable()
export class ContaReceitaProvider {

  public registros = [];

  constructor(public sqliteService: DatabaseProvider) { }

  //Seleciona todos os registros
  selectAll() {
    return new Promise(res => {
      this.registros = [];
      let query = "select * from CONTA_RECEITA";
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
          console.log('Erro na consulta SQL: selectAll - CONTA_RECEITA', e);
        });
    })

  }

  // Insere um registro
  addItem(contaReceita: ContaReceita) {
    return new Promise(resolve => {
      var query = "INSERT INTO CONTA_RECEITA (CODIGO, DESCRICAO) VALUES (?, ?)";
      var Dados = [contaReceita.CODIGO, contaReceita.DESCRICAO];
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
  updateItem(contaReceita: ContaReceita) {
    return new Promise(resolve => {
      var query = "UPDATE CONTA_RECEITA SET CODIGO = ?, DESCRICAO = ? WHERE ID = ?";
      var Dados = [contaReceita.CODIGO, contaReceita.DESCRICAO, contaReceita.ID];
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
      var query = "DELETE FROM CONTA_RECEITA WHERE ID = ?";
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


export class ContaReceita {
  ID: number;
  CODIGO: string;
  DESCRICAO: string;
}
