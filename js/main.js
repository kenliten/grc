;(function(name){

	'use strict';

	const customers = new PouchDB(name);
	const settings = new PouchDB('settings');
	const newCustomer = document.getElementById('customer-registry');

	var records = [];
	var customerList = document.getElementById('customers');
	var business = {};

	var isNewCustomer = document.getElementById('new-customer');

	const _trans = {
		name: 'Nombre: ',
		company: 'Empresa: ',
		job: 'Puesto: ',
		email: 'Email: ',
		phone: 'Teléfono: ',
		sales: 'Ventas: ',
		lastContact: 'Último Contacto: ',
		nextAction: 'Próxima Acción: ',
		nextContact: 'Próximo Contacto: ',
		status: 'Estado: ',
		source: 'Fuente: ',
		owner: 'Encargado: ',
		notes: 'Notas: '
	}

	customers.changes({since: 'now', live: true}).on('change', loadCustomers);
	settings.changes({since: 'now', live: true}).on('change', loadSettings);

	function updateUi(){
		document.getElementById('settings-business-name').value = business.name;
		document.getElementById('business-name').innerHTML = business.name;
	}

	async function loadSettings(){
		await settings.get('0').then( r =>{
			for (let field in r){
				business[field] = r[field];
			}
		}).catch( err => {
			console.log(err);

			$('#settings-modal').modal('toggle');
		});

		updateUi();
	}

	async function saveSettings(){
		// bn = business name
		let bn = document.getElementById('settings-business-name');

		await settings.get('0').then( r => {
			r.name = bn.value;

			return r;
		}).then( r => {
			settings.put(r);
		}).catch(err => {
			let doc = {
				_id: '0',
				name: bn.value
			};
			settings.put(doc);
		});

		$('#settings-modal').modal('hide');
	}

	async function saveCustomer(){
		let id;
		await customers.allDocs({include_docs: true}).then( r => {
			id = '' + (r.rows[r.total_rows].id + 1);
		});
		let customerName = document.getElementById('customer-name').value;
		let customerCompany = document.getElementById('customer-company').value;
		let customerJob = document.getElementById('customer-job').value;
		let customerEmail = document.getElementById('customer-email').value;
		let customerPhone = document.getElementById('customer-phone').value;

		let customerSales;
		let customerLastContact;
		let customerNextAction;
		let customerNextContact;
		let customerStatus;
		let customerSource;
		let customerOwner;
		let customerNotes;

		if (!isNewCustomer.checked == 'checked'){
			customerSales = document.getElementById('customer-sales').value;
			customerLastContact = document.getElementById('customer-last-contact').value;
			customerNextAction = document.getElementById('customer-next-action').value;
			customerNextContact = document.getElementById('customer-next-contact').value;
			customerStatus = document.getElementById('customer-status').value;
			customerSource = document.getElementById('customer-source').value;
			customerOwner = document.getElementById('customer-owner').value;
			customerNotes = document.getElementById('customer-notes').value;
		}else{
			customerSales = '';
			customerLastContact = '';
			customerNextAction = '';
			customerNextContact = '';
			customerStatus = '';
			customerSource = '';
			customerOwner = '';
			customerNotes = '';
		}

		let doc = {
			_id: id,
			name: customerName,
			company: customerCompany,
			job: customerJob,
			email: customerEmail,
			phone: customerPhone,
			sales: customerSales,
			lastContact: customerLastContact,
			nextAction: customerNextAction,
			nextContact: customerNextContact,
			status: customerStatus,
			source: customerSource,
			owner: customerOwner,
			notes: customerNotes,
		};

		await customers.put(doc).then( result =>{
			return true;
		}).catch( err =>{
			console.log(err);
		});

		$('#customer-registry-modal').modal('hide');
	}

	async function loadCustomers(){
		await customers.allDocs({include_docs: true}).then( result =>{
			let rows = result.rows;
			customerList.innerHTML = '';
			records = [];
			for (let row = 0; row < rows.length; row++){
				records.push(rows[row].doc);
			}
			
			showRegistry();
		}).catch( err =>{
			throw err;
		})
	}

	async function seeCustomer(record){
		let base = document.createElement('div');
		base.className = 'container-fluid';
		for (let field in _trans){
			let b = document.createElement('b');
			b.innerHTML = _trans[field];
			let p = document.createElement('p');
			p.appendChild(b);
			p.innerHTML += records[record][field];
			base.appendChild(p);
		}
		document.getElementById('customer-details').innerHTML = '';
		document.getElementById('customer-details').appendChild(base);

		$('#customer-details-modal').modal();

		document.getElementById('customer-details-edit-button').addEventListener('click', e => {
			openCustomerEdit(record);
			$('#customer-details-modal').modal('toggle');
		});
	}

	function openCustomerEdit(record){
		document.getElementById('customer-edit-target').value = records[record]._id;

		let editName = document.getElementById('customer-edit-name');
		editName.value = records[record].name;

		let editCompany = document.getElementById('customer-edit-company');
		editCompany.value = records[record].company;

		let editJob = document.getElementById('customer-edit-job');
		editJob.value = records[record].job;

		let editEmail = document.getElementById('customer-edit-email');
		editEmail.value = records[record].email;

		let editPhone = document.getElementById('customer-edit-phone');
		editPhone.value = records[record].phone;

		let editSales = document.getElementById('customer-edit-sales');
		editSales.value = records[record].sales;

		let editLastContact = document.getElementById('customer-edit-last-contact');
		editLastContact.value = records[record].lastContact;

		let editNextAction = document.getElementById('customer-edit-next-action');
		editNextAction.value = records[record].nextAction;

		let editNextContact = document.getElementById('customer-edit-next-contact');
		editNextContact.value = records[record].nextContact;

		let editStatus = document.getElementById('customer-edit-status');
		editStatus.value = records[record].status;

		let editSource = document.getElementById('customer-edit-source');
		editSource.value = records[record].source;

		let editOwner = document.getElementById('customer-edit-owner');
		editOwner.value = records[record].owner;

		let editNotes = document.getElementById('customer-edit-notes');
		editNotes.value = records[record].notes;

		$('#customer-edit-modal').modal();
	}

	async function editCustomer(){

		let editTarget = document.getElementById('customer-edit-target').value;

		let editName = document.getElementById('customer-edit-name').value;
		let editCompany = document.getElementById('customer-edit-company').value;
		let editJob = document.getElementById('customer-edit-job').value;
		let editEmail = document.getElementById('customer-edit-email').value;
		let editPhone = document.getElementById('customer-edit-phone').value;
		let editSales = document.getElementById('customer-edit-sales').value;
		let editLastContact = document.getElementById('customer-edit-last-contact').value;
		let editNextAction = document.getElementById('customer-edit-next-action').value;
		let editNextContact = document.getElementById('customer-edit-next-contact').value;
		let editStatus = document.getElementById('customer-edit-status').value;
		let editSource = document.getElementById('customer-edit-source').value;
		let editOwner = document.getElementById('customer-edit-owner').value;
		let editNotes = document.getElementById('customer-edit-notes').value;

		await customers.get(editTarget).then( r => {
			r.name = editName;
			r.company = editCompany;
			r.job = editJob;
			r.email = editEmail;
			r.phone = editPhone;
			r.sales = editSales;
			r.lastContact = editLastContact;
			r.nextAction = editNextAction;
			r.nextContact = editNextContact;
			r.status = editStatus;
			r.source = editSource;
			r.owner = editOwner;
			r.notes = editNotes;

			return r;
		}).then( r => {
			customers.put(r);
		}).catch(err => {
			console.log(err);
		});

		$('#customer-edit-modal').modal('hide');
	}

	async function deleteCustomer(record){
		let confirm = prompt('Estas a punto de borrar una entrada, esto no se podrá deshacer. ¿Seguro/a que deseas borrar la entrada?');

		if (confirm){
			await customers.get(record).then( r => {
				customers.remove(r);
			});
		}
	}

	function showRegistry(){
		let c = document.getElementById('customers');
		c.innerHTML = '';

		for (let record in records){

			let name = document.createElement('td');
			name.innerHTML = records[record].name;

			let company = document.createElement('td');
			company.innerHTML = records[record].company;

			let job = document.createElement('td');
			job.innerHTML = records[record].job;

			let email = document.createElement('td');
			email.innerHTML = records[record].email;

			let phone = document.createElement('td');
			phone.innerHTML = records[record].phone;

			let actions = document.createElement('td');

			let seeAction = document.createElement('a');
			seeAction.className = 'customer-action';
			seeAction.href = '#';
			seeAction.title = 'Ver';
			seeAction.innerHTML = '<i class="fas fa-eye"></i>&nbsp;';
			seeAction.addEventListener('click', e => {
				seeCustomer(('' + record));
			});

			actions.appendChild(seeAction);

			let editAction = document.createElement('a');
			editAction.className = 'customer-action';
			editAction.href = '#';
			editAction.title = 'Editar';
			editAction.innerHTML = '<i class="fas fa-edit"></i>&nbsp;';
			editAction.addEventListener('click', e => {
				openCustomerEdit(('' + record));
			});

			actions.appendChild(editAction);

			let deleteAction = document.createElement('a');
			deleteAction.className = 'customer-action';
			deleteAction.href = '#';
			deleteAction.title = 'Eliminar';
			deleteAction.innerHTML = '<i class="fas fa-trash"></i>';
			deleteAction.addEventListener('click', e => {
				deleteCustomer(('' + record));
			});

			actions.appendChild(deleteAction);

			let tr = document.createElement('tr');
			let th = document.createElement('th');
			th.scope = 'row';
			th.innerHTML = (parseInt(record) + 1);

			tr.appendChild(th);
			tr.appendChild(name);
			tr.appendChild(company);
			tr.appendChild(job);
			tr.appendChild(phone);
			tr.appendChild(email);
			tr.appendChild(actions);

			c.appendChild(tr);
		}
	}

	isNewCustomer.addEventListener('change', e =>{
		let optionalInfo = document.getElementById('optional-info');
		if (isNewCustomer.checked){
			optionalInfo.style.display = 'none';
		}else{
			optionalInfo.style.display = 'block';
		}
	});
	document.getElementById('new-customer-submit').addEventListener('click', saveCustomer);
	document.getElementById('settings-save').addEventListener('click', saveSettings);
	document.getElementById('edit-customer-submit').addEventListener('click', editCustomer);

	loadSettings();
	loadCustomers();

})( 'customers' );