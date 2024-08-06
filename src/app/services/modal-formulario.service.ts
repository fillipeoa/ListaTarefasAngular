import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalFormularioService {
  public exibirModalFormulario = signal<boolean>(false);

  constructor() {}

  exibir() {
    this.exibirModalFormulario.set(true);
  }

  ocultar() {
    this.exibirModalFormulario.set(false);
  }
}
