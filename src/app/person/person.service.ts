import { Injectable } from '@angular/core';

import Person from './person.model'

@Injectable({
  providedIn: 'root'
})

export class PersonService {

  constructor() { }

  public getAll() {
    let persons = localStorage.getItem('persons')
    if(persons) return JSON.parse(persons)
    return null
  }

  public getOne() {

  }

  public save(person: Person) {
    let persons = JSON.parse(localStorage.getItem('persons'))
    let index = persons.findIndex((foundPerson: Person) => Number(foundPerson.cpf) == Number(person.cpf))
    if (index == -1) index = persons.length
    persons[index] = person
    localStorage.setItem('persons', JSON.stringify(persons))
  }

  public delete(person: Person) {
    let persons = JSON.parse(localStorage.getItem('persons'))
    let cpf = Number(person.cpf)
    let index = persons.findIndex((foundPerson: { cpf: number }) => foundPerson.cpf == cpf)
    persons.splice(index, 1)
    localStorage.setItem('persons', JSON.stringify(persons))
  }

}
