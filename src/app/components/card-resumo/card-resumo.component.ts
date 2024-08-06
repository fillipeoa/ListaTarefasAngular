import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card-resumo',
  standalone: true,
  imports: [
    CardModule
  ],
  templateUrl: './card-resumo.component.html',
  styleUrls: ['./card-resumo.component.scss']
})
export class CardResumoComponent {
  @Input() titulo: string = '';
  @Input() porcentagem: string = '';
  @Input() icone: string = '';
}
