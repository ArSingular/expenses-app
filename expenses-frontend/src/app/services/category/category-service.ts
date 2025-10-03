import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../../models/category/category-dto.model';
import { HttpClient } from '@angular/common/http';


const baseUrl = 'http://localhost:8080/api/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient){}

  list(kind: 'INCOME'|'EXPENSE'):Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(baseUrl, { params: { kind } });
  
  }
  
}
