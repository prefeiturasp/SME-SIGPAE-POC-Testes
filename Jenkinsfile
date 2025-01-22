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

    environment { 
        NO_COLOR = '1' 
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
                sh 'npm install'
                sh 'npm install @shelex/cypress-allure-plugin'
                sh 'npm install mocha-allure-reporter --save-dev'
            }
        }

        stage('Generate Allure Report') { 
            steps {
                sh 'NO_COLOR=1 cypress run --reporter mocha-allure-reporter --browser chrome' 
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
            archiveArtifacts artifacts: '*.zip', fingerprint: true 
        }
    }
}