import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardResumoComponent } from '../../components/card-resumo/card-resumo.component';
import { MenuModule } from 'primeng/menu';
import { FormatarDataExtensoPipe } from '../../pipes/formatar-data-extenso.pipe';
import { OpcoesTabelaComponent } from '../../components/opcoes-tabela/opcoes-tabela.component';
import { TabelaComponent } from '../../components/tabela/tabela.component';
import { TarefasService } from '../../services/tarefas.service';
import { TooltipModule } from 'primeng/tooltip';
import { ModalFormularioComponent } from '../../components/modal-formulario/modal-formulario.component';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ButtonModule,
    CardResumoComponent,
    OpcoesTabelaComponent,
    TabelaComponent,
    MenuModule,
    FormatarDataExtensoPipe,
    TooltipModule,
    ModalFormularioComponent,
    DialogModule,
    ToastModule,
    ConfirmDialogModule   
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  
  dataAtual = new Date();

  visible: boolean = false;

  constructor(protected tarefasService: TarefasService) { }

  ngOnInit() {
    this.tarefasService.getAll();
  }

  showDialog() {
      this.visible = true;
  }
}
