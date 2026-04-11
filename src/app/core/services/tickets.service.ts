import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private API = 'http://localhost:3000/api/tickets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.API}/`)
  }

  getEvery(grupoId?: number, incluirBloqueados: boolean = false): Observable<any> {
    let params = new HttpParams();

    if (grupoId) {
        params = params.set('grupo_id', grupoId.toString());
    }

    if (incluirBloqueados) {
        params = params.set('incluir_bloqueados', 'true');
    }

    return this.http.get(`${this.API}/`, { params });
  }

  getByGrupo(grupo_id: Number): Observable<any> {
    return this.http.get(`${this.API}/grupo/${grupo_id}`)
  }

  getSinAsignar(grupo_id: Number): Observable<any> {
    return this.http.get(`${this.API}/sin-asignar/${grupo_id}`)
  }

  getAltaPrioridad(grupo_id: Number): Observable<any> {
    return this.http.get(`${this.API}/alta-prioridad/${grupo_id}`)
  }

  getCreados(grupo_id: Number): Observable<any> {
    return this.http.get(`${this.API}/creados/${grupo_id}`)
  }

  getAsignados(grupo_id: Number): Observable<any> {
    return this.http.get(`${this.API}/asignados/${grupo_id}`)
  }

  getById(ticket_id: Number): Observable<any> {
    return this.http.get(`${this.API}/${ticket_id}`)
  }

  create(ticket: any): Observable<any> {
    return this.http.post(`${this.API}/`, ticket);
  }

  update(ticketId: Number, ticket: any): Observable<any> {
    return this.http.put(`${this.API}/${ticketId}`, ticket);
  }

  cambiarEstado(ticketId: Number, ticket: any): Observable<any> {
    return this.http.patch(`${this.API}/${ticketId}/estado`, ticket);
  }

  asignar(ticketId: Number, ticket: any): Observable<any> {
    return this.http.patch(`${this.API}/${ticketId}/asignar`, ticket);
  }

  agregarComentario(ticketId: Number, ticket: any): Observable<any> {
    return this.http.post(`${this.API}/${ticketId}/comentarios`, ticket);
  }

  getMisTickets(grupoId: number): Observable<any> {
    return this.http.get(`${this.API}/mis-tickets/${grupoId}`)
  }

  /*getHistorial(ticketId: Number): Observable<any> {
    return this.http.get(`${this.API}/${ticketId}/historial`)
  }*/

  remove(ticketId: Number): Observable<any> {
    return this.http.delete(`${this.API}/${ticketId}`)
  }
}
