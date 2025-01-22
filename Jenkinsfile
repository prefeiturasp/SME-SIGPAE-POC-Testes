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
            yaml """ 
kind: Pod
apiVersion: v1
metadata:
 labels:
  some-label: some-label-value
spec:
 containers:
 - name: cypress-13-6-6
   image: cypress/base:13.6.6 // Substitua por uma imagem Cypress compatível com a sua configuração 
   command:
   - cat
   tty: true
 - name: java
   image: openjdk:8-jdk 
   command: 
   - cat 
   tty: true 
"""
        }
    }

    environment { 
        JAVA_HOME = '/usr/lib/jvm/java-8-openjdk-amd64' 
        PATH = "${JAVA_HOME}/bin:${env.PATH}" 
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
                container('java') {
                    sh 'chmod -R 777 /home/jenkins/agent/workspace/es_-_SIGPAE_feature_allureConfig/allure-results' 
                    allure([ 
                        results: [[path: 'allure-results']]
                    ])
                } 
            } 
        } 
    } 
    
    post { 
        always {
            container('java') {
                sh 'chmod -R 777 /home/jenkins/agent/workspace/es_-_SIGPAE_feature_allureConfig/allure-results' 
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
                archiveArtifacts artifacts: '*.zip', fingerprint: true 
            }
        }
    }
}