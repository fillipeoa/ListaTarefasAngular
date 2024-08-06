import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Estatisticas {
  lista: any[];
  total: number;
  concluidas: number;
  porcentagem: string;
  texto: string;
}

@Injectable({
  providedIn: 'root'
})
export class TarefasService {

  baseUrl = 'https://lista-tarefas-efbva9hyc9dxgjc4.eastus-01.azurewebsites.net/API';

  visualizacaoFiltrada = signal<string | null>(null);
  statusFiltrados = signal<string[]>([]);

  tarefas = signal<any[]>([]);

  estatisticas = {
    dia: this.inicializarEstatisticas(),
    semana: this.inicializarEstatisticas(),
    mes: this.inicializarEstatisticas()
  };

  constructor(private httpClient: HttpClient) {}

  private inicializarEstatisticas(): Estatisticas {
    return {
      lista: [],
      total: 0,
      concluidas: 0,
      porcentagem: '',
      texto: ''
    };
  }

  getAll() {
    this.httpClient.get<any[]>(`${this.baseUrl}/ListaTarefas`)
      .subscribe(res => {
        res.sort((a, b) => new Date(a.prazo_final).getTime() - new Date(b.prazo_final).getTime());
        this.tarefas.set(res);
        this.atualizarEstatisticas();
      });
  }

  getById(id: number) {
    return this.httpClient.get<any>(`${this.baseUrl}/ListaTarefas/${id}`);
  }

  atualizarEstatisticas() {
    const dataAtual = new Date();
    const dataFormatada = this.formatarDataString(dataAtual);

    this.estatisticas.dia = this.calcularEstatisticas(dataFormatada, dataFormatada);
    this.estatisticas.semana = this.calcularEstatisticas(this.getInicioSemana(dataAtual), this.getFimSemana(dataAtual));
    this.estatisticas.mes = this.calcularEstatisticas(this.getInicioMes(dataAtual), this.getFimMes(dataAtual));
  }

  private calcularEstatisticas(inicio: Date | string, fim: Date | string): Estatisticas {
    const inicioDate = typeof inicio === 'string' ? new Date(inicio) : inicio;
    const fimDate = typeof fim === 'string' ? new Date(fim) : fim;

    const lista = this.tarefas().filter(tarefa => {
      const prazoFinal = new Date(tarefa.prazo_final);
      return prazoFinal >= inicioDate && prazoFinal <= fimDate;
    });

    const total = lista.length;
    const concluidas = lista.filter(tarefa => tarefa.status === 'Concluida').length;
    const porcentagem = total === 0 ? '-' : `${parseFloat(((concluidas / total) * 100).toFixed(2))}%`;
    const texto = total === 0
      ? `Nenhuma tarefa com este prazo`
      : `${concluidas} de ${total} tarefas concluídas`;

    return { lista, total, concluidas, porcentagem, texto };
  }

  getInicioSemana(data: Date): Date {
    const diaSemana = data.getUTCDay();
    const inicioSemana = new Date(data);
    inicioSemana.setUTCDate(data.getUTCDate() - diaSemana);
    return new Date(Date.UTC(inicioSemana.getUTCFullYear(), inicioSemana.getUTCMonth(), inicioSemana.getUTCDate()));
  }

  getFimSemana(data: Date): Date {
    const inicioSemana = this.getInicioSemana(data);
    const fimSemana = new Date(inicioSemana);
    fimSemana.setUTCDate(inicioSemana.getUTCDate() + 6);
    return fimSemana;
  }

  getInicioMes(data: Date): Date {
    return new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), 1));
  }

  getFimMes(data: Date): Date {
    return new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth() + 1, 0));
  }

  formatarDataString(date: Date): string {
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const dia = date.getDate().toString().padStart(2, '0'); 

    return `${ano}-${mes}-${dia}`;
  }

  post(tarefa: any) {
    return this.httpClient.post(`${this.baseUrl}/ListaTarefas`, tarefa);
  }

  update(tarefa: any, id_tarefa: number) {
    return this.httpClient.put(`${this.baseUrl}/ListaTarefas/${id_tarefa}`, tarefa);
  }

  delete(id: number) {
    return this.httpClient.delete(`${this.baseUrl}/ListaTarefas/${id}`);
  }
}
