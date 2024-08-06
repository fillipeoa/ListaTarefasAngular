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
  styleUrls: ['./opcoes-tabela.component.scss']
})
export class OpcoesTabelaComponent {
  opcaoVisualizacaoSelecionada: string | null = null;
  opcoesVisualizacao: { label: string; value: string }[] = [
    { label: 'Hoje', value: 'dia' },
    { label: 'Esta Semana', value: 'semana' }
  ];

  statusSelecionados: string[] = [];
  status: { label: string; value: string }[] = [
    { label: 'Não iniciada', value: 'Não iniciada' },
    { label: 'Em andamento', value: 'Em andamento' },
    { label: 'Concluida', value: 'Concluida' }
  ];

  constructor(
    private tarefasService: TarefasService,
    protected modalFormularioService: ModalFormularioService
  ) {}

  selecionarStatus(): void {
    this.tarefasService.statusFiltrados.set(this.statusSelecionados);
  }

  limparFiltros(): void {
    this.statusSelecionados = [];
    this.tarefasService.statusFiltrados.set(this.statusSelecionados);
    this.opcaoVisualizacaoSelecionada = null;
    this.tarefasService.visualizacaoFiltrada.set(this.opcaoVisualizacaoSelecionada);
  }

  selecionarVisualizacao(): void {
    this.tarefasService.visualizacaoFiltrada.set(this.opcaoVisualizacaoSelecionada);
  }
}
