import { CommonModule } from '@angular/common';
import { Input, Component, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Ruta } from '../../interfaces/ruta.interface';
import { Chart } from 'chart.js';
import { SimpleChanges } from '@angular/core';
import { RutasService } from '../../service/rutas-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rutas-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarRutasComponent implements OnInit, OnDestroy {

  @Input()
  public rutas: Ruta[] = [];
  private suscripcion: Subscription | null = null;

  constructor(private rutasService: RutasService) { }

  // Al iniciar el componente, me suscribo al observable del servicio
  ngOnInit(): void {
    this.suscripcion = this.rutasService.rutas$.subscribe((rutasActualizadas) => {
      this.rutas = rutasActualizadas;
    });
  }

  // Al destruir el componente, me desuscribo del observable del servicio
  ngOnDestroy(): void {
      if(this.suscripcion!==null){
        this.suscripcion.unsubscribe();
      }
  }

  // Al emitir la ruta, la envio al servicio para borrar
  emitId(id: number): void {
    console.log("uso el servicio emitId para enviar: ", id);
    this.rutasService.borrarRuta(id);

  }

  // Al emitir la ruta, la envio al servicio, la borro y actualizo
  emitRuta(id: number, ruta: Ruta): void {
    console.log("Desde 'listado' envio: ", id, ruta)
    this.rutasService.borrarRuta(id);
    this.rutasService.actualizarRuta(ruta);
  }

  // Funciones ara ordenar las rutas
  ordenarPorDistanciaMenor(): void {
    this.rutas = [...this.rutas].sort((a, b) => a.distancia - b.distancia);
  }

  ordenarPorDistanciaMayor(): void {
    this.rutas = [...this.rutas].sort((a, b) => b.distancia - a.distancia);
  }

  ordenarPorFechaMenor(): void {
    this.rutas = [...this.rutas].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  ordenarPorFechaMayor(): void {
    this.rutas = [...this.rutas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  ordernarPorDuracionMenor(): void {
    this.rutas = [...this.rutas].sort((a, b) => a.horas * 60 + a.minutos - (b.horas * 60 + b.minutos));
  }

  ordenarPorDuracionMayor(): void {
    this.rutas = [...this.rutas].sort((a, b) => b.horas * 60 + b.minutos - (a.horas * 60 + a.minutos));
  }

  ordenarPorNombreMenor(): void {
    this.rutas = [...this.rutas].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  ordenarPorNombreMayor(): void {
    this.rutas = [...this.rutas].sort((a, b) => b.nombre.localeCompare(a.nombre));
  }  

}

