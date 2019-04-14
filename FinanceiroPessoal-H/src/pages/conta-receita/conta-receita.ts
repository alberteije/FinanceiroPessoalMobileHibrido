import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { ContaReceitaProvider, ContaReceita } from "../../providers/conta-receita/conta-receita";

@Component({
  selector: 'page-conta-receita',
  templateUrl: 'conta-receita.html'
})
export class ContaReceitaPage {

  contaReceita: ContaReceita;
  selectedItem: any;
  icons: string[];
  items: Array<{ id: number, codigo: string, descricao: string, icon: string }>;
  operacao: number; //1-consulta | 2-insercao | 3-edição | 4-exclusão

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService: ContaReceitaProvider, protected platform: Platform) {

    // Novo objeto para inserção
    this.contaReceita = new ContaReceita();

    // Pega os parâmetros
    this.selectedItem = navParams.get('item');
    this.operacao = navParams.get('operacao');

    if (!this.selectedItem) {

      this.icons = ['briefcase', 'cash', 'home', 'color-wand', 'apps'];

      this.items = [];

      this
        .platform
        .ready()
        .then(() => {
          this
            .sqliteService
            .selectAll()
            .then(s => {

              for (let i = 0; i < this.sqliteService.registros.length; i++) {
                this.items.push({
                  id: this.sqliteService.registros[i].ID,
                  codigo: this.sqliteService.registros[i].CODIGO,
                  descricao: this.sqliteService.registros[i].DESCRICAO,
                  //icon: this.icons[i]
                  //icon: this.icons[Math.floor(Math.random() * this.icons.length)]
                  icon: this.icons[i] != null ? this.icons[i] : this.icons[4]
                });
              }

            });
        })
    }
  }

  addItem(event, item) {
    this.navCtrl.push(ContaReceitaPage, {
      item: item, operacao: 2
    });
  }

  editItem(event, item) {
    this.navCtrl.push(ContaReceitaPage, {
      item: item, operacao: 3
    });
  }

  deleteItem(event, item) {
    this.navCtrl.push(ContaReceitaPage, {
      item: item, operacao: 4
    });
  }

  cancel() {
    this.navCtrl.pop();
  }

  save() {
    if (this.operacao == 2) {
      this
        .sqliteService
        .addItem(this.contaReceita)
        .then(s => {
          this.selectedItem = null;
        });
    } else if (this.operacao == 3) {

      this.contaReceita.ID = this.selectedItem.id;
      this.contaReceita.CODIGO = this.selectedItem.codigo;
      this.contaReceita.DESCRICAO = this.selectedItem.descricao;

      this
        .sqliteService
        .updateItem(this.contaReceita)
        .then(s => {
          this.selectedItem = null;
        });
    }

    this.navCtrl.pop();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  delete(event, item) {
    this
      .sqliteService
      .deleteItem(this.selectedItem.id)
      .then(s => {
        this.selectedItem = null;
      });

    this.navCtrl.pop();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

}
