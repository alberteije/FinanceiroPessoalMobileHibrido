import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { DatabaseProvider } from "../providers/database/database";
import { ContaReceitaProvider } from "../providers/conta-receita/conta-receita";
import { ContaDespesaProvider } from "../providers/conta-despesa/conta-despesa";
import { LancamentoReceitaProvider } from "../providers/lancamento-receita/lancamento-receita";
import { LancamentoDespesaProvider } from "../providers/lancamento-despesa/lancamento-despesa";
import { ExtratoBancarioProvider } from "../providers/extrato-bancario/extrato-bancario";
import { ResumoMensalProvider } from "../providers/resumo-mensal/resumo-mensal";

import { Intro } from '../pages/intro/intro';
import { ContaReceitaPage } from '../pages/conta-receita/conta-receita';
import { ContaDespesaPage } from '../pages/conta-despesa/conta-despesa';
import { LancamentoReceitaPage } from '../pages/lancamento-receita/lancamento-receita';
import { LancamentoDespesaPage } from '../pages/lancamento-despesa/lancamento-despesa';
import { ExtratoBancarioPage } from '../pages/extrato-bancario/extrato-bancario';
import { ResumoMensalPage } from '../pages/resumo-mensal/resumo-mensal';
import { GraficosPage } from '../pages/graficos/graficos';

@NgModule({
  declarations: [
    MyApp,
    Intro,
    ContaReceitaPage,
    ContaDespesaPage,
    LancamentoReceitaPage,
    LancamentoDespesaPage,
    ExtratoBancarioPage,
    ResumoMensalPage,
    GraficosPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Intro,
    ContaReceitaPage,
    ContaDespesaPage,
    LancamentoReceitaPage,
    LancamentoDespesaPage,
    ExtratoBancarioPage,
    ResumoMensalPage,
    GraficosPage
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DatabaseProvider,
    ContaReceitaProvider,
    ContaDespesaProvider,
    LancamentoReceitaProvider,
    LancamentoDespesaProvider,
    ExtratoBancarioProvider,
    ResumoMensalProvider
  ]
})
export class AppModule {}
