#!groovy
/*
Jenkinsfile for deploy new Atesmaps API version to PRE-PRODUCTION environment.
This job should be executed automatically when changes are pushed to develop branch
or running manually using Jenkins.
*/

init()

pipeline {
    agent { label agentLabel }

    environment {
        dockerHubRegistry = 'docker.io/atesmaps/atesmaps'
        dockerHubCredentials = 'docker-hub-atesmaps'
    }

    stages {
        stage('Start') {
            steps {
                sh('echo "Starting build and deploy tasks for Atesmaps TEST environment..."')
                sh('echo "Branch used for deploy: develop"')
            }
        }

        stage('Build docker image') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(
                        credentialsId: 'niltorrano-github',
                        keyFileVariable: 'id_rsa')]) {
                            sh 'mkdir -p ~/.ssh'
                            sh 'rm -rf ~/.ssh/id_rsa'
                            sh 'cat ${id_rsa} > ~/.ssh/id_rsa'
                            sh 'echo "Host github.com" > ~/.ssh/config'
                            sh 'echo "  HostName github.com" >> ~/.ssh/config'
                            sh 'echo "  IdentitiesOnly yes" >> ~/.ssh/config'
                            sh 'echo "  IdentityFile ~/.ssh/id_rsa" >> ~/.ssh/config'
                            sh 'chmod 400 ~/.ssh/id_rsa'
                            sh "make build"
                    }
                }
            }
        }

        stage('Stop and remove current release') {
            steps {
                script {
                    def remote = [:]
                    remote.name = 'atesmaps-test'
                    remote.host = '64.225.81.99'
                    remote.port = 2022
                    remote.allowAnyHosts = true
                    withCredentials([usernamePassword(
                        credentialsId: 'jenkins-atesmaps-userpass',
                        passwordVariable: 'passwd',
                        usernameVariable: 'username')]) {
                            remote.user = username
                            remote.password = passwd
                            sshCommand remote: remote, command: "docker stop atesmaps-api || true && docker rm atesmaps-api || true"
                    }
                }
            }
        }

        stage('Run new release') {
            steps {
                script {
                    def CURRENT_RELEASE = """${sh(returnStdout: true, script: 'git describe --tags `git rev-list --tags --max-count=1`').trim()}"""
                    sh('echo "Copying atesmaps docker image to test server..."')
                    sh('docker save -o /tmp/atesmaps-api.tar atesmaps-api:${CURRENT_RELEASE}')
                    def remote = [:]
                    remote.name = 'atesmaps-test'
                    remote.host = '64.225.81.99'
                    remote.port = 2022
                    remote.allowAnyHosts = true
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'jenkins-atesmaps-userpass',
                            passwordVariable: 'passwd',
                            usernameVariable: 'username')
                        ]) {
                            remote.user = username
                            remote.password = passwd
                            sshPut remote: remote, from: '/tmp/atesmaps-api.tar', into: '/tmp/atesmaps-api.tar'
                            sshCommand remote: remote, command: "docker load -i atesmaps-api:${CURRENT_RELEASE}"
                            sshCommand remote: remote, command: "docker run -d --restart=always -p 9500:3500 --name atesmaps-api atesmaps-api:${CURRENT_RELEASE}"
                            sshRemove remote: remote, path: '/tmp/atesmaps-api.tar'
                    }
                }
            }
        }

        stage('End') {
            steps {
                sh('echo "New Atesmaps API version deployed in TEST environment..."')
                sh('echo "Merge your changes to master branch for deploy in production or run job manually."')
                sh('rm -rf ~/.ssh/id_rsa')
                sh('rm -rf /tmp/atesmaps-api.tar')
            }
        }
    }

    post {
        failure {
            // Send this mail when job ends with errors
            emailext from: "",
                    to: "${NOTIFICATION_RECIPIENTS}",
                    replyTo: "",
                    mimeType: 'text/html',
                    subject: "Build FAILED in Jenkins: ${env.JOB_BASE_NAME} - #${env.BUILD_NUMBER}",
                    body: "Job ${env.JOB_NAME} <b>ended with errors</b>.<br />Check console output at ${env.BUILD_URL} or download attachment to view the results.<br /> \
                           <br />This build was executed using brach <b>develop</b>.<br /> \
                           If you do not want to receive these emails please contact the administrator.",
                    attachLog: true
        }
        unstable {
            // Send this mail when job ends with unstable status
            emailext from: "",
                    to: "${NOTIFICATION_RECIPIENTS}",
                    replyTo: "",
                    mimeType: 'text/html',
                    subject: "Build FAILED in Jenkins: ${env.JOB_BASE_NAME} - #${env.BUILD_NUMBER}",
                    body: "Job ${env.JOB_NAME} <b>ended with unstable status</b>.<br />Check console output at ${env.BUILD_URL} or download attachment to view the results.<br /> \
                           <br />This build was executed using brach <b>develop</b>.<br /> \
                           If you do not want to receive these emails please contact the administrator.",
                    attachLog: true
        }
        always {
            cleanWs()
        }
    }
}

/* Functions */

def init() {

    // Set jenkins agent
    agentLabel = "master"

}

/* PROPERTIES */

properties (
    [
        parameters([
            string(name: "NOTIFICATION_RECIPIENTS",
                defaultValue: "ntorrano@atesmaps.org",
                description: "Email notification recipients separated by comma.",
                trim: true
            )]
        )
    ]
)
