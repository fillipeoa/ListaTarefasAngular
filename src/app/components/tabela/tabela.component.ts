import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';

import { TarefasService } from '../../services/tarefas.service';
import { ModalFormularioService } from '../../services/modal-formulario.service';

@Component({
  selector: 'app-tabela',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule
  ],
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent {
  tarefas = computed(() => {
    let tarefasFiltradas = this.tarefasService.tarefas();
    const visualizacaoFiltrada = this.tarefasService.visualizacaoFiltrada();
    const statusFiltrados = this.tarefasService.statusFiltrados();

    if (visualizacaoFiltrada) {
      tarefasFiltradas = this.tarefasService.estatisticas[visualizacaoFiltrada].lista;
    }

    if (statusFiltrados.length > 0) {
      tarefasFiltradas = tarefasFiltradas.filter(tarefa => statusFiltrados.includes(tarefa.status));
    }

    return tarefasFiltradas;
  });

  constructor(
    private tarefasService: TarefasService,
    private messageService: MessageService,
    private modalFormularioService: ModalFormularioService,
    private confirmationService: ConfirmationService
  ) {}

  editarTarefa(id_tarefa: number): void {
    this.modalFormularioService.exibir();
    this.modalFormularioService.editarTarefa(id_tarefa);
  }

  excluirTarefa(id_tarefa: number, titulo: string): void {
    this.confirmationService.confirm({
      message: `Deseja mesmo excluir a tarefa "${titulo}"?`,
      header: 'Excluir tarefa',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        this.tarefasService.delete(id_tarefa).subscribe({
          next: () => {
            this.tarefasService.getAll();
            this.messageService.add({ severity: 'success', summary: 'Tarefa excluída', detail: 'Tarefa excluída com sucesso!' });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro ao excluir', detail: 'Erro ao excluir tarefa!' });
          }
        });
      }
    });
  }

  obterCorStatus(status: string): "success" | "warning" | "secondary" | null {
    switch (status) {
      case 'Concluida':
        return 'success';
      case 'Em andamento':
        return 'warning';
      case 'Não iniciada':
        return 'secondary';
      default:
        return null;
    }
  }
}
