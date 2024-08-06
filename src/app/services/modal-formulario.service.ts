import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalFormularioService {
  public exibirModalFormulario = signal<boolean>(false);
  public idTarefaEditada = signal<number>(0);

  constructor() {}

  exibir() {
    this.exibirModalFormulario.set(true);
  }

  ocultar() {
    this.exibirModalFormulario.set(false);
  }

  editarTarefa(id_tarefa: number) {
    this.idTarefaEditada.set(id_tarefa);
  }

}
