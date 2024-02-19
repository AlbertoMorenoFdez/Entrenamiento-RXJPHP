// Importaciones necesarias de Angular y Chart.js
import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { RutasService } from '../../service/rutas-service'
import 'chartjs-adapter-date-fns';
import { Ruta } from '../../interfaces/ruta.interface';

import annotationPlugin from 'chartjs-plugin-annotation';




// Registro de los componentes necesarios de Chart.js
Chart.register(...registerables);
Chart.register(annotationPlugin);

// Decorador de Componente que define el selector y la plantilla HTML
@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',

})
export class GraficoComponent implements OnInit, OnChanges {

  constructor(private rutasService: RutasService) {
    this.chartRef = {} as ElementRef;
    this.rutas = [];
  }


  // Referencia al elemento del DOM donde se creará el gráfico
  @ViewChild('chart') private chartRef!: ElementRef;

  // Datos que se mostrarán en el gráfico
  @Input() rutas: Ruta[];

  // Referencia al objeto de grafico de Chart.js
  chart: any;

  // Metodo de ciclo de vida de Angular que se ejecuta al iniciar el componente
  ngOnInit(): void { }

  // Método de ciclo de vida que se ejecuta después de la inicialización de la vista del componente
  // Aquí es donde se crea el gráfico de Chart.js
  ngAfterViewInit(): void {
    this.rutasService.rutas$.subscribe(rutasData => {
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(this.chartRef.nativeElement, {

        type: 'line',
        data: {
          datasets: [{
            label: 'Rutas',
            data: rutasData.map((ruta: any) => ({
              x: new Date(ruta.fecha),
              y: ruta.distancia,
              nombre: ruta.nombre,
              horas: ruta.horas,
              minutos: ruta.minutos,
              distancia: ruta.distancia,
            })).sort((a: any, b: any) => Number(a.x) - Number(b.x)),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointStyle: 'circle',
            pointRadius: 4,
            backgroundColor: 'lightblue',
          }]
        },

        options: { // Añade los ejes y sus títulos
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
              title: {
                display: true,
                text: 'Fecha'
              }
            },
            y: {
              min: 0,
              title: {
                display: true,
                text: 'Distancia (km)'
              }
            }
          },

          plugins: { // Añade el tooltip y los datos que debe mostrar
            tooltip: {
              callbacks: {
                label: function (context) {
                  const ruta: any = context.raw;
                  return `Nombre: ${ruta.nombre}, Duración: ${ruta.horas}h:${ruta.minutos}m, Distancia: ${ruta.distancia}km`;
                }
              }
            },
            annotation: { // Añade las líneas de referencia
              annotations: {
                line1: {
                  type: 'line',
                  yMin: 20,
                  yMax: 20,
                  borderColor: 'rgb(255, 99, 132)',
                  borderWidth: 2,
                },
                line2: {
                  type: 'line',
                  yMin: 40,
                  yMax: 40,
                  borderColor: 'rgb(255, 202, 44)',
                  borderWidth: 2,
                },
              },
            },
          },

          layout: {
            padding: 50
          }
        }

      });
    });

  }

  // Método de ciclo de vida que se ejecuta cuando cambian los datos de entrada del componente
  // Aquí es donde se actualizan los datos del gráfico
  ngOnChanges(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.rutas.map(ruta => ({
        x: new Date(ruta.fecha),
        y: ruta.distancia,
        nombre: ruta.nombre,
        horas: ruta.horas,
        minutos: ruta.minutos,
        distancia: ruta.distancia
      })).sort((a, b) => Number(a.x) - Number(b.x));
      this.chart.update();
    }
  }
}