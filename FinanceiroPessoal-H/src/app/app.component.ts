import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { DatabaseProvider } from "../providers/database/database";

import { Intro } from '../pages/intro/intro';
import { ContaReceitaPage } from '../pages/conta-receita/conta-receita';
import { ContaDespesaPage } from '../pages/conta-despesa/conta-despesa';
import { LancamentoReceitaPage } from '../pages/lancamento-receita/lancamento-receita';
import { LancamentoDespesaPage } from '../pages/lancamento-despesa/lancamento-despesa';
import { ExtratoBancarioPage } from '../pages/extrato-bancario/extrato-bancario';
import { ResumoMensalPage } from '../pages/resumo-mensal/resumo-mensal';
import { GraficosPage } from '../pages/graficos/graficos';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = Intro;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, db: DatabaseProvider) {
    this.initializeApp(db);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Início', component: Intro },
      { title: 'Contas de Receita', component: ContaReceitaPage },
      { title: 'Contas de Despesa', component: ContaDespesaPage },
      { title: 'Lançamento de Receita', component: LancamentoReceitaPage },
      { title: 'Lançamento de Despesa', component: LancamentoDespesaPage },
      { title: 'Extrato Bancário', component: ExtratoBancarioPage },
      { title: 'Resumo Mensal', component: ResumoMensalPage },
      { title: 'Gráficos', component: GraficosPage }
    ];

  }

  initializeApp(db: DatabaseProvider) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      db.openDb();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
