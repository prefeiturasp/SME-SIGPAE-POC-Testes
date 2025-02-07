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
                script {
                    //sh 'mkdir -p /home/jenkins/.cache/Cypress'
                    //sh 'chmod -R 777 /home/jenkins/.cache/Cypress'
                    sh 'chmod -R 777 .'
                    sh 'mkdir -p /home/jenkins/.cache/Cypress'
                    sh 'wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | tee /etc/apt/trusted.gpg.d/google.asc >/dev/null'
                    sh 'mkdir -p /usr/share/man/man1/ && apt update && apt install -y default-jre zip'
                    sh 'npm install'
                    sh 'npm install @shelex/cypress-allure-plugin'
                    sh 'npm install allure-mocha --save-dev'                    
                }
            }
        }

        stage('Executar') {
            steps {
                script {
                    sh '''
                        NO_COLOR=1 npx cypress run \
                            --headless \
                            --spec cypress/e2e/api/* \
                            --reporter mocha-allure-reporter \
                            --browser chrome
                    '''
                }
            }
        }

        stage('Generate Allure Report') { 
            steps {
                script {
                    sh 'chmod -R 777 /home/jenkins/agent/workspace/es_-_SIGPAE_feature_allureConfig/allure-results'
                    sh 'rm -rf /var/lib/jenkins/jobs/POC - Testes - SIGPAE/branches/feature-allureConfig.ucnqdg/builds/${BUILD_NUMBER}/archive/allure-report.zip'
                    allure([ 
                        results: [[path: 'allure-results']]
                    ])
                    
                }
            } 
        } 
    } 
    
    post { 
        always {
            script {
                //sh 'rm -f allure-report.zip'
                //sh 'chmod -R 777 .'
                //sh 'chmod -R 777 /home/jenkins/agent/workspace/es_-_SIGPAE_feature_allureConfig/allure-results'
                //sh 'cd /var/lib/jenkins/jobs/POC - Testes - SIGPAE/branches/feature-allureConfig.ucnqdg/builds/${BUILD_NUMBER}/archive/ ls -la'
                
                //sh 'zip -r allure-results-${BUILD_NUMBER}-$(date +"%d-%m-%Y").zip allure-results'
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
                archiveArtifacts artifacts: 'allure-results-${BUILD_NUMBER}-$(date +"%d-%m-%Y").zip', fingerprint: true
            }
        }
        unstable { 
            sendTelegram("💣 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Unstable \nLog: \n${env.BUILD_URL}allure") 
        }
        failure { 
            sendTelegram("💥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Failure \nLog: \n${env.BUILD_URL}allure") 
        }
        aborted { 
            sendTelegram ("😥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Aborted \nLog: \n${env.BUILD_URL}allure") 
        }
    }
}

    def sendTelegram(message) {
        def encodedMessage = URLEncoder.encode(message, "UTF-8")
        withCredentials([string(credentialsId: 'telegramTokensigpae', variable: 'TOKEN'),
        string(credentialsId: 'telegramChatIdsigpae', variable: 'CHAT_ID')]) {
            response = httpRequest (consoleLogResponseBody: true,
                    contentType: 'APPLICATION_JSON',
                    httpMode: 'GET',
                    url: 'https://api.telegram.org/bot' + "$TOKEN" + '/sendMessage?text=' + encodedMessage + '&chat_id=' + "$CHAT_ID" + '&disable_web_page_preview=true',
                    validResponseCodes: '200')
            return response
        }
    }