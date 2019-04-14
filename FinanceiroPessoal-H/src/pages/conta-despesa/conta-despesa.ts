import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ContaDespesaProvider, ContaDespesa } from "../../providers/conta-despesa/conta-despesa";

@Component({
  selector: 'page-conta-despesa',
  templateUrl: 'conta-despesa.html'
})
export class ContaDespesaPage {

  contaDespesa: ContaDespesa;
  selectedItem: any;
  icons: string[];
  items: Array<{ id: number, codigo: string, descricao: string, icon: string }>;
  operacao: number; //1-consulta | 2-insercao | 3-edição | 4-exclusão

  constructor(public navCtrl: NavController, private toast: ToastController, public navParams: NavParams, public sqliteService: ContaDespesaProvider, protected platform: Platform) {

    // Novo objeto para inserção
    this.contaDespesa = new ContaDespesa();

    // Pega os parâmetros
    this.selectedItem = navParams.get('item');
    this.operacao = navParams.get('operacao');

    if (!this.selectedItem) {

      this.icons = ['book', 'medkit', 'pizza', 'home', 'car', 'football',
        'cash', 'barcode', 'paper', 'briefcase', 'jet', 'hand', 'color-wand', 'apps'];

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
                  icon: this.icons[i] != null ? this.icons[i] : this.icons[13]
                });
              }

            });
        })
    }
  }
  
  addItem(event, item) {
    this.navCtrl.push(ContaDespesaPage, {
      item: item, operacao: 2
    });
  }

  editItem(event, item) {
    this.navCtrl.push(ContaDespesaPage, {
      item: item, operacao: 3
    });
  }

  deleteItem(event, item) {
    this.navCtrl.push(ContaDespesaPage, {
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
        .addItem(this.contaDespesa)
        .then(s => {
          this.selectedItem = null;
        });
    } else if (this.operacao == 3) {

      this.contaDespesa.ID = this.selectedItem.id;
      this.contaDespesa.CODIGO = this.selectedItem.codigo;
      this.contaDespesa.DESCRICAO = this.selectedItem.descricao;

      this
        .sqliteService
        .updateItem(this.contaDespesa)
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

    this.toast.create({ message: 'Item Removido.', duration: 3000, position: 'botton' }).present();

    this.navCtrl.pop();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

}
