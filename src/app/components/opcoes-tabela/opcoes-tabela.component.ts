import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TarefasService } from '../../services/tarefas.service';
import { ModalFormularioService } from '../../services/modal-formulario.service';

@Component({
  selector: 'app-opcoes-tabela',
  standalone: true,
  imports: [
    FormsModule,
    SelectButtonModule,
    MultiSelectModule,
    ButtonModule
  ],
  templateUrl: './opcoes-tabela.component.html',
  styleUrl: './opcoes-tabela.component.scss'
})
export class OpcoesTabelaComponent {
  constructor(
    private tarefasService: TarefasService,
    protected modalFormularioService: ModalFormularioService
  ) { }

  opcaoVisualizacaoSelecionada!: string;
  opcoesVisualizacao: any[] = [
      { label: 'Hoje', value: 'dia' },
      { label: 'Esta Semana', value: 'semana' },
  ];

  statusSelecionados!: string[];
  status = [
      {label: 'Não iniciada', value: 'Não iniciada'},
      {label: 'Em andamento', value: 'Em andamento'},
      {label: 'Concluida', value: 'Concluida'}
  ];

  selecionarStatus() {
    this.tarefasService.statusFiltrados.set(this.statusSelecionados);
  }	

  limparFiltros() {
    this.statusSelecionados = [];
    this.tarefasService.statusFiltrados.set(this.statusSelecionados);
    this.opcaoVisualizacaoSelecionada = null;
    this.tarefasService.visualizacaoFiltrada.set(this.opcaoVisualizacaoSelecionada);
  }	

  selecionarVisualizacao(){
    this.tarefasService.visualizacaoFiltrada.set(this.opcaoVisualizacaoSelecionada);
  }
}
