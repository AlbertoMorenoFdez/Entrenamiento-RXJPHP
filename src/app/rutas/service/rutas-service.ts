import { Injectable } from '@angular/core';
import { Ruta } from '../interfaces/ruta.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from './php.service';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class RutasService {
  private _rutas: BehaviorSubject<Ruta[]> = new BehaviorSubject<Ruta[]>([]); // Lista de rutas
  private _ruta = new Subject<Ruta>(); // Ruta que actualizo

  // Observables
  rutas$ = this._rutas.asObservable();
  ruta$ = this._ruta.asObservable();

  // Al constructor le inyectamos el servicio de BBDD indexada
  constructor(private apiService: ApiService) {
    this.loadInitialData();
  }

  // Al cargar la página, carga los datos iniciales de las rutas desde IndexedDB
  loadInitialData() {
    this.apiService.getAllRutas().pipe(
      tap((rutas: Ruta[]) => {
        this._rutas.next(rutas);
      })
    ).subscribe();
    console.log("La Consulta a la BD devuelve: ", this._rutas);
  }

  // CREAR COMPONENT.TS
  // Añade una nueva ruta al array de rutas y actualiza el valor de las rutas en BBDD

  anadirRuta(ruta: Ruta) {
    console.log("uso el servicio añadirRuta para enviar: ", ruta);

    this.apiService.addRuta(ruta).subscribe({
      next: (res) => {
        console.log("Respuesta del servidor al añadir ruta:", res);
        this.loadInitialData();
      },
      error: (error: any) => {
        console.log("Error al añadir la ruta: ", error);
      }
    })
  }


  // LISTAR.COMPONENTS.TS
  borrarRuta(id: number) {
    console.log("uso el servicio borrarRuta para borrar: ", id);
    this.apiService.deleteRuta(id).subscribe({
      next: () => {
        this.loadInitialData();
      },
      error: (error: any) => {
        console.log("Error al borrar la ruta: ", error.error);
      }
    })
  }

  async actualizarRuta(ruta: Ruta) {
    console.log("uso el servicio actualizarRuta para enviar: ", ruta);
    this._ruta.next(ruta);  // Actualiza de la ruta

  }

  // Cuando se crea e incia el componente se ejecuta automaticamente ngOnInit que ejecutara loadInitalData
  // cargando los datos iniciales de las rutas desde BBDD
  ngOnInit(): void {
    this.loadInitialData();
  }

}
