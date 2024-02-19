import { Component, SimpleChanges, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { Ruta } from '../../interfaces/ruta.interface';
import { RutasService } from '../../service/rutas-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rutas-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearRutaComponent implements OnChanges, OnInit, OnDestroy {

public ruta: Ruta = {nombre : '', fecha: '', distancia: 0, horas: 0, minutos: 0};
private suscripcion: Subscription | null = null;
  
  constructor(private rutasService: RutasService) { }

  // Al iniciar el componente, me suscribo al observable del servicio
  ngOnInit(){
    this.suscripcion = this.rutasService.ruta$.subscribe(ruta => {
      this.ruta = ruta;
    });
  }

  // Al destruir el componente, me desuscribo del observable del servicio
  ngOnDestroy(): void {
    if(this.suscripcion!==null){
      this.suscripcion.unsubscribe();
    }
  }

  // Al emitir la ruta, la envio al servicio
  emitirRuta(): void {
    console.log("uso el servicio emitirRuta para enviar a rutasService: ", this.ruta);
    this.rutasService.anadirRuta(this.ruta);
    this.ruta= {nombre : '', fecha: '', distancia: 0, horas: 0, minutos: 0};
   
  }

  // Al detectar cambios en el componente, actualizo la ruta
  ngOnChanges(changes: SimpleChanges) {
    console.log("Detecto cambios en el componente crear");
    if (changes['ruta'] && changes['ruta'].currentValue) {
      this.ruta = { ...changes['ruta'].currentValue };
    }
  }
}
