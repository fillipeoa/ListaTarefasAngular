import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { CardResumoComponent } from '../../components/card-resumo/card-resumo.component';
import { ModalFormularioComponent } from '../../components/modal-formulario/modal-formulario.component';
import { OpcoesTabelaComponent } from '../../components/opcoes-tabela/opcoes-tabela.component';
import { TabelaComponent } from '../../components/tabela/tabela.component';

import { TarefasService } from '../../services/tarefas.service';
import { FormatarDataExtensoPipe } from '../../pipes/formatar-data-extenso.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    MenuModule,
    TagModule,
    ToastModule,
    TooltipModule,
    CardResumoComponent,
    ModalFormularioComponent,
    OpcoesTabelaComponent,
    TabelaComponent,
    FormatarDataExtensoPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  dataAtual: Date = new Date();
  visible: boolean = false;

  constructor(protected tarefasService: TarefasService) { }

  ngOnInit(): void {
    this.tarefasService.getAll();
  }

  showDialog(): void {
    this.visible = true;
  }
}
