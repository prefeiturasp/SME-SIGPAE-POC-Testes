const { defineConfig } = require('cypress')
const allureWriter = require('@shelex/cypress-allure-plugin/writer')

module.exports = defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			allureWriter(on, config)
			require('./cypress/plugin/index.js')(on, config)
			on('before:browser:launch', (browser = {}, launchOptions) => {
				if (browser.name === 'chrome') {
					launchOptions.args.push('--no-sandbox')
					launchOptions.args.push('--disable-dev-shm-usage')
				}
				return launchOptions
			})
			return config
		},
		baseUrl: 'https://hom-sigpae.sme.prefeitura.sp.gov.br/',
		usuario_coordenador_logistica: '07206148808',
		usuario_coordenador_codae_dilog_logistica: '53666852220',
		usuario_coordenador_supervisao_nutricao: '26088238070',
		usuario_diretor_ue: '44331733637',
		senha: 'adminadmin',
		video: false,
		timeout: 60000,
		videoCompression: 0,
		retries: 2,
		screenshotOnRunFailure: true,
		chromeWebSecurity: false,
		experimentalRunAllSpecs: true,
		failOnStatusCode: false,
		specPattern: 'cypress/e2e/**/**/*.{feature,cy.{js,jsx,ts,tsx}}',
	},
})
