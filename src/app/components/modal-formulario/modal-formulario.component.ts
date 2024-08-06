import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ModalFormularioService } from '../../services/modal-formulario.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TarefasService } from '../../services/tarefas.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { effect } from '@angular/core';

@Component({
  selector: 'app-modal-formulario',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule,
    CalendarModule,
    ToastModule
  ],
  templateUrl: './modal-formulario.component.html',
  styleUrl: './modal-formulario.component.scss',
  providers: []
})
export class ModalFormularioComponent {
  constructor(
    protected modalFormularioService: ModalFormularioService,
    private tarefasService: TarefasService,
    public messageService: MessageService
  ) { }

  idTarefa = 0;
  
  titulo: string = '';
  
  statusSelecionado: number = 1;
  status = [
      {label: 'Não iniciada', value: 1},
      {label: 'Em andamento', value: 2},
      {label: 'Concluida', value: 3}
  ];

  prazo_final = new Date();

  preencherFormulario = effect(() => {
    this.idTarefa = this.modalFormularioService.idTarefaEditada();
    if(this.idTarefa === 0){
      this.limparFormulario();
    }
    if(this.idTarefa !== 0){
      this.tarefasService.getById(this.idTarefa)
      .subscribe((res: any)=>{
        this.titulo = res.titulo;
        this.statusSelecionado = res.status_id;
        this.prazo_final = new Date(res.prazo_final);
      });
    }
  });

  limparFormulario(){
    this.titulo = '';
    this.statusSelecionado = 1;
    this.prazo_final = new Date();
  }

  salvarTarefa(){
    this.modalFormularioService.ocultar();
    if(this.idTarefa === 0){
      this.cadastrarTarefa();
    }
    if(this.idTarefa !== 0){
      this.alterarTarefa();
    }
  }

  cadastrarTarefa(){
    this.tarefasService.post
    ({
      titulo: this.titulo,
      status_id: this.statusSelecionado,
      prazo_final: this.prazo_final.toISOString().split('T')[0]
    })
    .subscribe((res: any)=>{
      this.tarefasService.getAll();
      this.limparFormulario();
      this.messageService.add({severity:'success', summary:'Tarefa salva', detail:'Tarefa salva com sucesso!'});
    },
    (error: any)=>{
      this.messageService.add({severity:'error', summary:'Erro ao salvar', detail:'Erro ao salvar tarefa!'});
    }
    );
  }

  alterarTarefa(){
    this.tarefasService.update
    (
      {
        id: this.idTarefa,
        titulo: this.titulo,
        status_id: this.statusSelecionado,
        prazo_final: this.prazo_final.toISOString().split('T')[0]
      },
      this.idTarefa
    )
    .subscribe((res: any)=>{
      this.tarefasService.getAll();
      this.limparFormulario();
      this.messageService.add({severity:'success', summary:'Tarefa atualizada', detail:'Tarefa atualizada com sucesso!'});
    },
    (error: any)=>{
      this.messageService.add({severity:'error', summary:'Erro ao atualizar', detail:'Erro ao atualizar tarefa!'});
    }
    );
  }
}
