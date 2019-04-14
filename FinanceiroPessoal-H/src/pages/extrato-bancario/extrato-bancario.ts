import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { FileChooser } from 'ionic-native';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { parse as parseOFX } from 'ofx-js';

import { ExtratoBancarioProvider, ExtratoBanco } from "../../providers/extrato-bancario/extrato-bancario";
import { LancamentoDespesaProvider, LancamentoDespesa } from "../../providers/lancamento-despesa/lancamento-despesa";
import { LancamentoReceitaProvider, LancamentoReceita } from "../../providers/lancamento-receita/lancamento-receita";

@Component({
    selector: 'page-extrato-bancario',
    templateUrl: 'extrato-bancario.html'
})
export class ExtratoBancarioPage {

  extratoBanco: ExtratoBanco;
  lancamentoReceita: LancamentoReceita;
  lancamentoDespesa: LancamentoDespesa;
  items: Array<{ id: number, mesAno: string, dataTransacao: string, valor: number, idTransacao: string, checknum: string, numeroReferencia: string, historico: string, conciliado: string }>;
  mesAnoSelecionado; arquivoOfx; filtro: string;
  totalCredito; totalDebito; saldo: number;

  constructor(public navCtrl: NavController, private toast: ToastController, public sqliteService: ExtratoBancarioProvider, public sqliteServiceLancamentoDespesa: LancamentoDespesaProvider, public sqliteServiceLancamentoReceita: LancamentoReceitaProvider, protected platform: Platform, public http: Http, private alertCtrl: AlertController) {
    this.items = [];
  }


  selecionarArquivo() {
    FileChooser.open()
      .then(uri => this.arquivoOfx = uri)
      .catch(e => console.log(e));
  }

  carregarDados() {

    //se não tiver selecionado o arquivo
    //verifica se tem dados no banco
    //se tiver carrega os dados na tela

    if (this.arquivoOfx == null) {
      this.carregarDadosBanco();
    }

    //se tiver selecionado o arquivo
    //apaga os dados no banco para o mês selecionado
    //persiste os dados no banco
    //carrega os dados do arquivo na tela

    else {

      this.sqliteService.deleteMes(this.mesAnoSelecionado);

      this.http.get(this.arquivoOfx).map(res => res.text()).subscribe(data => {
        parseOFX(data).then(ofxData => {

          const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
          const accountId = statementResponse.BANKACCTFROM.ACCTID;
          const currencyCode = statementResponse.CURDEF;
          const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;

          for (let i = 0; i < transactionStatement.length; i++) {

            // Novo objeto para inserção
            this.extratoBanco = new ExtratoBanco();

            // Informa os dados para o objeto
            this.extratoBanco.MES_ANO = this.mesAnoSelecionado;
            this.extratoBanco.DATA_TRANSACAO = transactionStatement[i].DTPOSTED.substring(0, 4) + '-' + transactionStatement[i].DTPOSTED.substring(4, 6) + '-' + transactionStatement[i].DTPOSTED.substring(6, 8);
            this.extratoBanco.VALOR = transactionStatement[i].TRNAMT;
            this.extratoBanco.ID_TRANSACAO = transactionStatement[i].FITID;
            this.extratoBanco.CHECKNUM = transactionStatement[i].CHECKNUM;
            this.extratoBanco.NUMERO_REFERENCIA = transactionStatement[i].REFNUM;
            this.extratoBanco.HISTORICO = transactionStatement[i].MEMO;
            this.extratoBanco.CONCILIADO = transactionStatement[i].TRNAMT.substring(0, 1);

            // Persiste o objeto no banco de dados
            this
              .sqliteService
              .addItem(this.extratoBanco)
              .then(s => {
              });

          }

          // Carrega os dados do banco na tela
          this.carregarDadosBanco();
        });
      });

    }

  }

  carregarDadosBanco() {
    // Zera as variáveis de totais
    this.totalDebito = 0;
    this.totalCredito = 0;
    this.saldo = 0;

    this.items = [];

    this.filtro = "MES_ANO = '" + this.mesAnoSelecionado + "'";

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
                dataTransacao: this.sqliteService.registros[i].DATA_TRANSACAO,
                valor: this.sqliteService.registros[i].VALOR,
                idTransacao: this.sqliteService.registros[i].ID_TRANSACAO,
                checknum: this.sqliteService.registros[i].CHECKNUM,
                numeroReferencia: this.sqliteService.registros[i].NUMERO_REFERENCIA,
                historico: this.sqliteService.registros[i].HISTORICO,
                conciliado: this.sqliteService.registros[i].CONCILIADO,
              });

              if (this.sqliteService.registros[i].CONCILIADO == '-') {
                this.totalDebito = this.totalDebito + this.sqliteService.registros[i].VALOR;
              } else {
                this.totalCredito = this.totalCredito + this.sqliteService.registros[i].VALOR;
              }
              this.saldo = this.saldo + this.sqliteService.registros[i].VALOR;

            }

          });
      })
  }


  exportarLancamentos() {

    let alert = this.alertCtrl.create({
      title: 'Exportar Dados',
      message: 'Deseja exportar os dados como Lançamentos de Receita e Despesa?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Usuário selecionou NÃO');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.exportarDados();
          }
        }
      ]
    });
    alert.present();

  }

  exportarDados() {

    for (let i = 0; i < this.items.length; i++) {

      // Verifica se é um lançamento de receita ou de despesa
      if (this.items[i].conciliado == "-") {

        // Novo objeto para inserção
        this.lancamentoDespesa = new LancamentoDespesa();

        // Informa os dados para o objeto
        this.lancamentoDespesa.MES_ANO = this.mesAnoSelecionado;
        this.lancamentoDespesa.DATA_RECEITA = this.items[i].dataTransacao;
        this.lancamentoDespesa.HISTORICO = this.items[i].historico;
        this.lancamentoDespesa.VALOR = this.items[i].valor * -1;

        // Persiste o objeto no banco de dados
        this
          .sqliteServiceLancamentoDespesa
          .addItem(this.lancamentoDespesa)
          .then(s => {
          });

      } else {

        // Novo objeto para inserção
        this.lancamentoReceita = new LancamentoReceita();

        // Informa os dados para o objeto
        this.lancamentoReceita.MES_ANO = this.mesAnoSelecionado;
        this.lancamentoReceita.DATA_RECEITA = this.items[i].dataTransacao;
        this.lancamentoReceita.HISTORICO = this.items[i].historico;
        this.lancamentoReceita.VALOR = this.items[i].valor;

        // Persiste o objeto no banco de dados
        this
          .sqliteServiceLancamentoReceita
          .addItem(this.lancamentoReceita)
          .then(s => {
          });

      }

    }

    this.toast.create({ message: 'Dados exportados com sucesso.', duration: 5000, position: 'botton' }).present();

  }

}
