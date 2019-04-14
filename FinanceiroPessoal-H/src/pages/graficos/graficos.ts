import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { LancamentoDespesaProvider, LancamentoDespesa } from "../../providers/lancamento-despesa/lancamento-despesa";
import { LancamentoReceitaProvider, LancamentoReceita } from "../../providers/lancamento-receita/lancamento-receita";

@Component({
  selector: 'page-graficos',
  templateUrl: 'graficos.html'
})
export class GraficosPage {

  itemsReceita: Array<{ mesAno: string, codigo: string, descricao: string, valor: number, percentual: number }>;
  itemsDespesa: Array<{ mesAno: string, codigo: string, descricao: string, valor: number, percentual: number }>;
  mesAnoSelecionado: string;
  totalCredito; totalDebito: number;

  constructor(public navCtrl: NavController, protected platform: Platform, public sqliteServiceLancamentoDespesa: LancamentoDespesaProvider, public sqliteServiceLancamentoReceita: LancamentoReceitaProvider) {
    this.itemsReceita = [];
    this.itemsDespesa = [];
  }

  carregarDados() {

    // Zera as variáveis de totais
    this.totalDebito = 0;
    this.totalCredito = 0;

    this.itemsReceita = [];
    this.itemsDespesa = [];

    this
      .platform
      .ready()
      .then(() => {

        this
          .sqliteServiceLancamentoReceita
          .selectAgrupado(this.mesAnoSelecionado)
          .then(s => {

            // nesse primeiro laço eu pego apenas o totalCredito para calcular o percentual depois
            for (let i = 0; i < this.sqliteServiceLancamentoReceita.registros.length; i++) {
              this.totalCredito = this.totalCredito + this.sqliteServiceLancamentoReceita.registros[i].VALOR;
            }

            // no segundo laço carrego o array e consigo calcular o percentual correto
            for (let i = 0; i < this.sqliteServiceLancamentoReceita.registros.length; i++) {

              this.itemsReceita.push({
                mesAno: this.sqliteServiceLancamentoReceita.registros[i].MES_ANO.substring(5, 7) + '/' + this.sqliteServiceLancamentoReceita.registros[i].MES_ANO.substring(0, 4),
                codigo: this.sqliteServiceLancamentoReceita.registros[i].CODIGO,
                descricao: this.sqliteServiceLancamentoReceita.registros[i].DESCRICAO,
                valor: this.sqliteServiceLancamentoReceita.registros[i].VALOR,
                percentual: Math.round(this.sqliteServiceLancamentoReceita.registros[i].VALOR / this.totalCredito * 100)
              });

            }

          });

        this
          .sqliteServiceLancamentoDespesa
          .selectAgrupado(this.mesAnoSelecionado)
          .then(s => {

            // nesse primeiro laço eu pego apenas o totalDebito para calcular o percentual depois
            for (let i = 0; i < this.sqliteServiceLancamentoDespesa.registros.length; i++) {
              this.totalDebito = this.totalDebito + this.sqliteServiceLancamentoDespesa.registros[i].VALOR;
            }

            // no segundo laço carrego o array e consigo calcular o percentual correto
            for (let i = 0; i < this.sqliteServiceLancamentoDespesa.registros.length; i++) {

              this.itemsDespesa.push({
                mesAno: this.sqliteServiceLancamentoDespesa.registros[i].MES_ANO.substring(5, 7) + '/' + this.sqliteServiceLancamentoDespesa.registros[i].MES_ANO.substring(0, 4),
                codigo: this.sqliteServiceLancamentoDespesa.registros[i].CODIGO,
                descricao: this.sqliteServiceLancamentoDespesa.registros[i].DESCRICAO,
                valor: this.sqliteServiceLancamentoDespesa.registros[i].VALOR,
                percentual: Math.round(this.sqliteServiceLancamentoDespesa.registros[i].VALOR / this.totalDebito * 100)
              });

            }

          });

      })

  }

}
