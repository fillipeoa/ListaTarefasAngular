import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TarefasService {

  constructor(private httpClient: HttpClient){}

  baseUrl = 'https://lista-tarefas-efbva9hyc9dxgjc4.eastus-01.azurewebsites.net/API'

  visualizacaoFiltrada = signal<string>(null);
  statusFiltrados = signal<string[]>([]);

  tarefas = signal<any[]>([]);

  estatisticas = {
    dia: {
      lista: [],
      total: 0,
      concluidas: 0,
      porcentagem: '',
      texto: ''
    },
    semana: {
      lista: [],
      total: 0,
      concluidas: 0,
      porcentagem: '',
      texto: ''
    },
    mes: {
      lista: [],
      total: 0,
      concluidas: 0,
      porcentagem: '',
      texto: ''
    }
  }
  
  getAll() {
    this.httpClient.get(this.baseUrl + '/ListaTarefas')
    .subscribe((res: any)=>{
      this.tarefas.set(res);
      this.atualizarEstatisticas();
    });
  }

  atualizarEstatisticas() {
      const dataAtual = new Date();
      const dataFormatada = new Date(Date.UTC(dataAtual.getUTCFullYear(), dataAtual.getUTCMonth(), dataAtual.getUTCDate())).toISOString().split('T')[0];
      
      this.estatisticas.dia.lista = this.tarefas().filter(tarefa => {
          const prazoFinal = new Date(tarefa.prazo_final).toISOString().split('T')[0];
          return prazoFinal === dataFormatada;
      });
      this.estatisticas.dia.total = this.estatisticas.dia.lista.length;
      this.estatisticas.dia.concluidas = this.estatisticas.dia.lista.filter(tarefa => tarefa.status === 'Concluida').length;
      if(this.estatisticas.dia.total === 0) {
          this.estatisticas.dia.porcentagem = '-';
          this.estatisticas.dia.texto = 'Nenhuma tarefa com prazo para hoje';
      } else {
          this.estatisticas.dia.porcentagem = `${parseFloat(((this.estatisticas.dia.concluidas / this.estatisticas.dia.total) * 100).toFixed(2))}%`;
          this.estatisticas.dia.texto = `${this.estatisticas.dia.concluidas} de ${this.estatisticas.dia.total} tarefas para hoje concluídas`;
      }

      const inicioSemana = this.getInicioSemana(dataAtual);
      this.estatisticas.semana.lista = this.tarefas().filter(tarefa => {
          const prazoFinal = new Date(tarefa.prazo_final);
          return prazoFinal >= inicioSemana && prazoFinal <= dataAtual;
      });
      this.estatisticas.semana.total = this.estatisticas.semana.lista.length;
      this.estatisticas.semana.concluidas = this.estatisticas.semana.lista.filter(tarefa => tarefa.status === 'Concluida').length;
      if (this.estatisticas.semana.total === 0) {
          this.estatisticas.semana.porcentagem = '-';
          this.estatisticas.semana.texto = 'Nenhuma tarefa com prazo para esta semana';
      } else {
          this.estatisticas.semana.porcentagem = `${parseFloat(((this.estatisticas.semana.concluidas / this.estatisticas.semana.total) * 100).toFixed(2))}%`;
          this.estatisticas.semana.texto = `${this.estatisticas.semana.concluidas} de ${this.estatisticas.semana.total} tarefas para esta semana concluídas`;
      }

      const inicioMes = new Date(Date.UTC(dataAtual.getUTCFullYear(), dataAtual.getUTCMonth(), 1));
      this.estatisticas.mes.lista = this.tarefas().filter(tarefa => {
          const prazoFinal = new Date(tarefa.prazo_final);
          return prazoFinal >= inicioMes && prazoFinal <= dataAtual;
      });
      this.estatisticas.mes.total = this.estatisticas.mes.lista.length;
      this.estatisticas.mes.concluidas = this.estatisticas.mes.lista.filter(tarefa => tarefa.status === 'Concluida').length;
      if (this.estatisticas.mes.total === 0) {
          this.estatisticas.mes.porcentagem = '-';
          this.estatisticas.mes.texto = 'Nenhuma tarefa com prazo para este mês';
      } else {
          this.estatisticas.mes.porcentagem = `${parseFloat(((this.estatisticas.mes.concluidas / this.estatisticas.mes.total) * 100).toFixed(2))}%`;
          this.estatisticas.mes.texto = `${this.estatisticas.mes.concluidas} de ${this.estatisticas.mes.total} tarefas para este mês concluídas`;
      }
  }

  getInicioSemana(data: Date): Date {
      const dataClone = new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate()));
      const dia = dataClone.getUTCDay();
      const diff = dataClone.getUTCDate() - dia;
      return new Date(Date.UTC(dataClone.getUTCFullYear(), dataClone.getUTCMonth(), diff));
  }

  getInicioMes(data: Date): Date {
    return new Date(data.getFullYear(), data.getMonth(), 1);
  }

  post(tarefa: any) {
    return this.httpClient.post(this.baseUrl + '/ListaTarefas', tarefa);
  }

  delete(id: any) {
    return this.httpClient.delete(this.baseUrl + '/ListaTarefas/' + id);
  }
}
