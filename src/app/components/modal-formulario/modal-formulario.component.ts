import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { effect } from '@angular/core';
import { ModalFormularioService } from '../../services/modal-formulario.service';
import { TarefasService } from '../../services/tarefas.service';

@Component({
  selector: 'app-modal-formulario',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './modal-formulario.component.html',
  styleUrls: ['./modal-formulario.component.scss']
})
export class ModalFormularioComponent {
  idTarefa: number = 0;
  titulo: string = '';
  statusSelecionado: number = 1;
  prazo_final: Date = new Date();

  status = [
    { label: 'Não iniciada', value: 1 },
    { label: 'Em andamento', value: 2 },
    { label: 'Concluida', value: 3 }
  ];

  constructor(
    protected modalFormularioService: ModalFormularioService,
    private tarefasService: TarefasService,
    public messageService: MessageService
  ) {}

  preencherFormulario = effect(() => {
    this.idTarefa = this.modalFormularioService.idTarefaEditada();
    if (this.idTarefa === 0) {
      this.limparFormulario();
    } else {
      this.tarefasService.getById(this.idTarefa).subscribe((res: any) => {
        this.titulo = res.titulo;
        this.statusSelecionado = res.status_id;
        this.prazo_final = new Date(res.prazo_final);
      });
    }
  });

  limparFormulario(): void {
    this.titulo = '';
    this.statusSelecionado = 1;
    this.prazo_final = new Date();
  }

  salvarTarefa(): void {
    this.modalFormularioService.ocultar();
    if (this.idTarefa === 0) {
      this.cadastrarTarefa();
    } else {
      this.alterarTarefa();
    }
  }

  cadastrarTarefa(): void {
    this.tarefasService.post({
      titulo: this.titulo,
      status_id: this.statusSelecionado,
      prazo_final: this.prazo_final.toISOString().split('T')[0]
    }).subscribe(
      (res: any) => {
        this.tarefasService.getAll();
        this.limparFormulario();
        this.messageService.add({
          severity: 'success',
          summary: 'Tarefa salva',
          detail: 'Tarefa salva com sucesso!'
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao salvar',
          detail: 'Erro ao salvar tarefa!'
        });
      }
    );
  }

  alterarTarefa(): void {
    this.tarefasService.update({
      id: this.idTarefa,
      titulo: this.titulo,
      status_id: this.statusSelecionado,
      prazo_final: this.prazo_final.toISOString().split('T')[0]
    }, this.idTarefa).subscribe(
      (res: any) => {
        this.tarefasService.getAll();
        this.limparFormulario();
        this.messageService.add({
          severity: 'success',
          summary: 'Tarefa atualizada',
          detail: 'Tarefa atualizada com sucesso!'
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao atualizar',
          detail: 'Erro ao atualizar tarefa!'
        });
      }
    );
  }
}
