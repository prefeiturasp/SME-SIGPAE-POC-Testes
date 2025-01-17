import postgreSQL from 'cypress-postgresql'
postgreSQL.loadDBCommands()

import './commands_api/commands_login'
import './commands_api/commands_alimentos'
import './commands_api/commands_alergias_intolerancias'
import './commands_api/commands_alimentos_da_guia'
import './commands_api/commands_alteracoes_cardapio'

import './commands_ui/commands_login'
import './commands_ui/commands_globais'

import '@shelex/cypress-allure-plugin'

Cypress.on('uncaught:exception', (err, runnable) => {
	if (err.message.includes('zygote_host_impl_linux')) {
		return false
	}
})
