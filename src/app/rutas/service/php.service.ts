import { Injectable } from "@angular/core";
import { Ruta } from "../interfaces/ruta.interface";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class ApiService{
    private url = 'https://albertomorenoserver.000webhostapp.com/entrenamiento-bici';

    constructor(private http: HttpClient){}

    getAllRutas(): Observable<Ruta[]>{
        return this.http.get<Ruta[]>(`${this.url}/leer.php`);
    }

    addRuta(ruta: Ruta): Observable<Ruta>{
        return this.http.post<Ruta>(`${this.url}/grabar.php`, ruta);
    }

    updateRuta(id: number, ruta: Ruta): Observable<Ruta>{
        return this.http.put<Ruta>(this.url + '/' + id, ruta);
    }

    deleteRuta(id: number): Observable<any>{
        return this.http.post(`${this.url}/borrar.php`, { id });
    }
}