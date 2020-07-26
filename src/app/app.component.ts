import { Component } from '@angular/core';
import { CepService } from './cep.service';

import { PersonService } from './person/person.service';
import Person from './person/person.model'

const personData = require("./person/personData.json")

const populateTable = () =>  localStorage.setItem('persons', JSON.stringify(personData))


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	title = 'Helpper Teste'

	personsList: Person[] = []
	personsTableColumns = ['name', 'cpf', 'phone', 'email', 'cep', 'state', 'city', 'street', 'actions']

	selectedPerson: Person = null
	loading: boolean = false
	toView: boolean = false

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
		this.toView = true
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
			this.cepService.getCep(cep)
				.then((apiResponse: any) => {
					if (apiResponse.erro) {
						this.loading = false
						alert('Cep não encontrado')
					}
					else {
						this.selectedPerson = {
							...this.selectedPerson,
							cep: apiResponse.cep.replace('-', ''),
							state: apiResponse.uf,
							city: apiResponse.localidade,
							street: apiResponse.logradouro
						}
					}
				})
				.catch(error => {
					alert('Erro ao buscar o cep')
					console.error(error)
				})
				.finally(() => this.loading = false)
		}
		else if (this.selectedPerson.cep)
			this.selectedPerson = {
				...this.selectedPerson,
				state: null,
				city: null,
				street: null
			}
	}

	//ao cancelar o formulário
	onCancel() {
		this.toView = false
		this.selectedPerson = null
	}

	//submissão dos valores do form
	onSubmit(person: Person) {
		if (!this.formIsValid()) {
			alert('Erro!\nPreencha todos os campos!')
		} else {
			this.personService.save(person)
			this.personsList = this.personService.getAll()
			this.selectedPerson = null
		}
	}

	//validação do cep
	cepInvalid() {
		return this.selectedPerson.cep && !this.loading && !this.selectedPerson.state
	}

	//validação do formulário
	formIsValid() {
		if (this.selectedPerson.phone && this.selectedPerson.phone == 0)
			alert('Erro!\nEsse número é invalido!')
		return (this.selectedPerson && this.selectedPerson.name && this.selectedPerson.cpf &&
			this.selectedPerson.phone!==null && this.selectedPerson.email && !this.cepInvalid())
	}
}



