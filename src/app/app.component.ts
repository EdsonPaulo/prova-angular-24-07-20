import { Component } from '@angular/core';
import { CepService } from './cep.service';

import { PersonService } from './person/person.service';
import Person from './person/person.model'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	title = 'Helper Teste'

	personsList: Person[] = []
	personsTableColumns = ['name', 'cpf', 'phone', 'email', 'cep', 'state', 'city', 'street', 'actions']

	selectedPerson: Person = null
	loading: boolean = false

	constructor(public cepService: CepService, private personService: PersonService) { }

	ngOnInit() {
		if (!this.personService.getAll() || !this.personService.getAll().length)
			populateTable()
		this.personsList = this.personService.getAll()
	}

	onAddPerson() {
		this.selectedPerson = new Person()
	}

	onViewPerson(person: Person) {
		this.selectedPerson = { ...person }
	}

	onEditPerson(person: Person) {
		this.selectedPerson = { ...person }
	}

	onDeletePerson(person: Person) {
		this.personService.delete(person)
		this.personsList = this.personService.getAll()
	}


	onChangeCep(event) {
		let cep = event.target.value
		if (cep.length == 8) {
			this.loading = true
			this.cepService.getCep(cep).then((apiResponse: any) => {
				if (apiResponse.erro) {
					alert('Cep não encontrado')
				} else {
					this.selectedPerson = {
						...this.selectedPerson,
						cep: apiResponse.cep.replace('-', ''),
						state: apiResponse.uf,
						city: apiResponse.localidade,
						street: apiResponse.logradouro
					}
				}
			}).catch(error => {
				alert('Erro ao buscar o cep')
				console.error(error)
			}).finally(() => this.loading = false)
		}
	}


	onCancel() {
		this.selectedPerson = null
	}

	onSubmit(person: Person) {
		var error = false
		this.personsTableColumns.forEach((key: string) => {
			if (key !== 'actions' && !person[key]) {
				error = true
			}
		})

		if (error) {
			alert('Erro!\nPreencha todos os campos!')
		} else {
			this.personService.save(person)
			this.personsList = this.personService.getAll()
			this.selectedPerson = null
		}
	}
}


function populateTable() {
	let persons = [
		{
			name: 'Maria Flores',
			cpf: '83321492075',
			phone: '1533283928',
			email: 'maria_f@gmail.com',
			cep: '69906043',
			state: 'AC',
			city: 'Rio Branco',
			street: 'Rua Arnaldo Aleixo (Conjunto Canaã)',
		},
		{
			name: 'João Carlos',
			cpf: '31213393035',
			phone: '1532841040',
			email: 'joao.c@gmail.com',
			cep: '79096766',
			state: 'MS',
			city: 'Campo Grande',
			street: 'Rua Rodolfho José Rospide da Motta',
		},
		{
			name: 'Stephanie Dias',
			cpf: '02085196020',
			phone: '1533294040',
			email: 'ste.dias@gmail.com',
			cep: '23825080',
			state: 'RJ',
			city: 'Itaguaí',
			street: 'Rua Mario Bastos Filho',
		},
		{
			name: 'Mirtes Souza',
			cpf: '33764389001',
			phone: '1530178756',
			email: 'irma.mirtes@gmail.com',
			cep: '40420150',
			state: 'BA',
			city: 'Salvador',
			street: '1ª Travessa Clóvis de Almeida Maia',
		}
	]
	localStorage.setItem('persons', JSON.stringify(persons))
}
