pipeline {
    triggers { cron('00 22 * * 0-4') }
    options {
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
        disableConcurrentBuilds()
        skipDefaultCheckout()
    }

    agent {
        kubernetes {
            label 'cypress'
            defaultContainer 'cypress-13-6-6'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Instalar Dependências') {
            steps {
                sh 'mkdir -p /home/jenkins/.cache/Cypress'
                sh 'chmod -R 777 /home/jenkins/.cache/Cypress'
                sh "mkdir -p /usr/share/man/man1/ && apt update && apt install -y default-jre zip"
                sh 'npm install'
                sh 'npm install @shelex/cypress-allure-plugin'
                sh 'npm install allure-mocha --save-dev'
            }
        }

        stage('Executar') {
            steps {
                sh '''
                    NO_COLOR=1 npx cypress run \
                        --headless \
                        --spec cypress/e2e/api/* \
                        --reporter mocha-allure-reporter \
                        --browser chrome
                '''
            }
        }

        stage('Generate Allure Report') { 
            steps {
                sh 'chmod -R 777 /home/jenkins/agent/workspace/es_-_SIGPAE_feature_allureConfig/allure-results' 
                allure([ 
                    results: [[path: 'allure-results']]
                ])
            } 
        } 
    } 
    
    post { 
        always {
            sh 'chmod -R 777 /home/jenkins/agent/workspace/es_-_SIGPAE_feature_allureConfig/allure-results'
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            sh 'rm -f allure-results-*.zip'
            sh 'zip -r allure-results-$(date +"%d-%m-%Y").zip cypress/*'            
            archiveArtifacts artifacts: '*.zip', fingerprint: true 
        }
    }
}