import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { LancamentoReceitaProvider, LancamentoReceita } from "../../providers/lancamento-receita/lancamento-receita";
import { ContaReceitaProvider } from "../../providers/conta-receita/conta-receita";

@Component({
  selector: 'page-lancamento-receita',
  templateUrl: 'lancamento-receita.html'
})
export class LancamentoReceitaPage {

  lancamentoReceita: LancamentoReceita;
  selectedItem: any;
  items: Array<{ id: number, mesAno: string, codigo: string, dataReceita: string, historico: string, valor: number, situacao: string }>;
  contas: Array<{ id: number, codigo: string, descricao: string }>;
  operacao: number; //1-consulta | 2-insercao | 3-edição | 4-exclusão
  totalReceber; totalRecebido; totalGeral: number;
  mesAnoSelecionado; contaSelecionada; filtro: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService: LancamentoReceitaProvider, public sqliteServiceConta: ContaReceitaProvider, protected platform: Platform) {

    // Zera as variáveis de totais
    this.totalReceber = 0;
    this.totalRecebido = 0;
    this.totalGeral = 0;

    // Novo objeto para inserção
    this.lancamentoReceita = new LancamentoReceita();

    // Pega os parâmetros
    this.selectedItem = navParams.get('item');
    this.operacao = navParams.get('operacao');
    this.mesAnoSelecionado = navParams.get('mesAnoSelecionado');
    this.contaSelecionada = navParams.get('contaSelecionada');

    this.items = [];
    this.contas = [];

    // Configura o filtro
    this.filtro = "MES_ANO = '" + this.mesAnoSelecionado + "'";
    if (this.contaSelecionada != null) {
      this.filtro = this.filtro + " and CODIGO = " + this.contaSelecionada;
    }

    if (this.mesAnoSelecionado == null) {
      this.filtro = "ID > 0";
    }

    this
      .platform
      .ready()
      .then(() => {

        this
          .platform
          .ready()
          .then(() => {

            this
              .sqliteService
              //.selectAll()
              .selectFilter(this.filtro)
              .then(s => {

                for (let i = 0; i < this.sqliteService.registros.length; i++) {

                  this.items.push({
                    id: this.sqliteService.registros[i].ID,
                    mesAno: this.sqliteService.registros[i].MES_ANO.substring(5, 7) + '/' + this.sqliteService.registros[i].MES_ANO.substring(0, 4), //this.sqliteService.registros[i].MES_ANO,
                    codigo: this.sqliteService.registros[i].CODIGO,
                    dataReceita: this.sqliteService.registros[i].DATA_RECEITA,
                    historico: this.sqliteService.registros[i].HISTORICO,
                    valor: this.sqliteService.registros[i].VALOR,
                    situacao: this.sqliteService.registros[i].SITUACAO
                  });

                  if (this.sqliteService.registros[i].SITUACAO == 'RECEBIDO') {
                    this.totalRecebido = this.totalRecebido + this.sqliteService.registros[i].VALOR;
                  } else {
                    this.totalReceber = this.totalReceber + this.sqliteService.registros[i].VALOR;
                  }
                  this.totalGeral = this.totalGeral + this.sqliteService.registros[i].VALOR;
                }

              });

          })

        this
          .sqliteServiceConta
          .selectAll()
          .then(s => {

            for (let i = 0; i < this.sqliteServiceConta.registros.length; i++) {
              this.contas.push({
                id: this.sqliteServiceConta.registros[i].ID,
                codigo: this.sqliteServiceConta.registros[i].CODIGO,
                descricao: this.sqliteServiceConta.registros[i].DESCRICAO
              });
            }
          });

      })
  }

  addItem(event, item, mesAnoSelecionado, contaSelecionada) {
    this.navCtrl.push(LancamentoReceitaPage, {
      item: item, operacao: 2, mesAnoSelecionado: mesAnoSelecionado, contaSelecionada: contaSelecionada
    });
  }

  editItem(event, item, mesAnoSelecionado, contaSelecionada) {
    this.navCtrl.push(LancamentoReceitaPage, {
      item: item, operacao: 3, mesAnoSelecionado: mesAnoSelecionado, contaSelecionada: contaSelecionada
    });
  }

  deleteItem(event, item, mesAnoSelecionado, contaSelecionada) {
    this.navCtrl.push(LancamentoReceitaPage, {
      item: item, operacao: 4, mesAnoSelecionado: mesAnoSelecionado, contaSelecionada: contaSelecionada
    });
  }

  filtrar(event, mesAnoSelecionado, contaSelecionada) {
    this.navCtrl.setRoot(this.navCtrl.getActive().component, { operacao: 1, mesAnoSelecionado: mesAnoSelecionado, contaSelecionada: contaSelecionada });
  }

  cancel(event, item, mesAnoSelecionado, contaSelecionada) {
    this.navCtrl.pop();
  }

  save(event, item, mesAnoSelecionado, contaSelecionada) {
    if (this.operacao == 2) {
      this.lancamentoReceita.MES_ANO = this.lancamentoReceita.DATA_RECEITA.toString().substring(0, 7);
      this
        .sqliteService
        .addItem(this.lancamentoReceita)
        .then(s => {
          this.selectedItem = null;
        });
    } else if (this.operacao == 3) {
      this.lancamentoReceita.ID = this.selectedItem.id;
      this.lancamentoReceita.MES_ANO = this.selectedItem.dataReceita.toString().substring(0, 7);
      this.lancamentoReceita.CODIGO = this.selectedItem.codigo != null ? this.selectedItem.codigo : "2001";
      this.lancamentoReceita.DATA_RECEITA = this.selectedItem.dataReceita;
      this.lancamentoReceita.HISTORICO = this.selectedItem.historico;
      this.lancamentoReceita.VALOR = this.selectedItem.valor;
      this.lancamentoReceita.SITUACAO = this.selectedItem.situacao;

      this
        .sqliteService
        .updateItem(this.lancamentoReceita)
        .then(s => {
          this.selectedItem = null;
        });
    }

    this.navCtrl.pop();
    this.navCtrl.setRoot(this.navCtrl.getActive().component, { operacao: 1, mesAnoSelecionado: mesAnoSelecionado, contaSelecionada: contaSelecionada });
  }

  delete(event, item, mesAnoSelecionado, contaSelecionada) {
    this
      .sqliteService
      .deleteItem(this.selectedItem.id)
      .then(s => {
        this.selectedItem = null;
      });

    this.navCtrl.pop();
    this.navCtrl.setRoot(this.navCtrl.getActive().component, { operacao: 1, mesAnoSelecionado: mesAnoSelecionado, contaSelecionada: contaSelecionada });
  }


}
