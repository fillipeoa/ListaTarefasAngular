import { Component, computed, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TarefasService } from '../../services/tarefas.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  styleUrl: './tabela.component.scss'
})
export class TabelaComponent {
  constructor(
    private tarefasService: TarefasService,
    private messageService: MessageService,
    private modalFormularioService: ModalFormularioService,
    private confirmationService: ConfirmationService
  ) { }
  
  ngOnInit() {
  }

  tarefas = computed(() => {
    let tarefasFiltradas = this.tarefasService.tarefas();
    const visualizacaoFiltrada = this.tarefasService.visualizacaoFiltrada();
    const statusFiltrados = this.tarefasService.statusFiltrados();

    if(visualizacaoFiltrada) {
      tarefasFiltradas =  this.tarefasService.estatisticas[visualizacaoFiltrada].lista;
    }
    if(statusFiltrados.length > 0) {
      tarefasFiltradas =  tarefasFiltradas.filter(tarefa => statusFiltrados.includes(tarefa.status));
    }

    return tarefasFiltradas;
  });

  editarTarefa(id_tarefa: number){
    this.modalFormularioService.exibir();
    this.modalFormularioService.editarTarefa(id_tarefa);
  }
  
  excluirTarefa(id_tarefa: number, titulo: string){
    this.confirmationService.confirm({
      message: 'Deseja mesmo excluir a tarefa "'+titulo+'"?',
      header: 'Excluir tarefa',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-secondary p-button-text",

      accept: () => {
        this.tarefasService.delete(id_tarefa)
          .subscribe((res: any)=>{
            this.tarefasService.getAll();
            this.messageService.add({severity:'success', summary:'Tarefa excluída', detail:'Tarefa excluída com sucesso!'});
          },
          (error: any)=>{
            this.messageService.add({severity:'error', summary:'Erro ao excluir', detail:'Erro ao excluir tarefa!'});
          }
          );
      }
    });
  }
  
  obterCorStatus(status: any) {
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
  };
}
