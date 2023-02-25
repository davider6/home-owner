import { Injectable } from '@angular/core';
import { RequestFields } from '../model/bo/RequestFields';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  contractors: RequestFields[];

  constructor() { }
}
