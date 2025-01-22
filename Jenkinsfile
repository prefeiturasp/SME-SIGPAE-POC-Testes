pipeline {
    triggers { cron('00 22 * * 0-4') }
    options {
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
        disableConcurrentBuilds()
        skipDefaultCheckout()
    }

    agent { kubernetes {
            label 'cypress'
            defaultContainer 'cypress-13-6-6'
        }
    }
        
    stages {

        stage('Cypress Test'){
           steps {
              script{
                    sh "whoami"
                    sh "chmod -Rf 777 ."
                    sh "pwd"
                    sh "mkdir -p /usr/share/man/man1/ && apt update && apt install -y default-jre zip"
                    sh "npm i -D @shelex/cypress-allure-plugin"
                    sh "npm i -D npm i -D mocha-allure-reporter"                    
                    sh "npm install cypress --save-dev"
                    sh "NO_COLOR=1 cypress run --reporter mocha-allure-reporter --browser chrome"
              }
          }           
        }
    }
    
    post {
        always { 
            sh 'chmod -Rf 777 . && rm -Rf results*.zip && zip -r results-$(date +"%d-%m-%Y").zip cypress/*'
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            archiveArtifacts artifacts: '*.zip', fingerprint: true 
        }    
    }
}