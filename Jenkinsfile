pipeline {
  agent any

  environment {
        PROJECT_ID = 'ghori-aya'
        ARTIFACT_REGISTRY_LOCATION = 'us-central1'
      //CLOUD_RUN_SERVICE_NAME_STAGING = 'bd-api-staging'
        CLOUD_RUN_SERVICE_NAME_PRODUCTION = 'bd-api-prod'
      //IMAGE_NAME_STAGING = 'us-central1-docker.pkg.dev/ghori-aya/bd-api-staging/staging'
        IMAGE_NAME_PROD = 'us-central1-docker.pkg.dev/ghori-aya/bd-api-production/production'
      //BRANCH_STAGING = 'staging'
        BRANCH_PROD = 'main'
        GIT_CREDENTIALS_ID = 'git-ssh-key-yoto-be'
  }

  stages {
    stage('Production') {
          when {
            branch 'main'
          }        
          steps {
            script {
              try{
                notifyBuild('STARTED','0','0')
                git branch: 'main', url: 'git@github.com:dnnaeinc/fs-bd-backend.git', credentialsId: "${GIT_CREDENTIALS_ID}"
                                          
              }
      
              catch (e) {
                currentBuild.result = "FAILED"
                notifyBuild(currentBuild.result,'0','0')
                throw e
              }
            }

            script {
              try{
                    sh "docker build . -t ${IMAGE_NAME_PROD}:${env.BUILD_NUMBER}"
                    sh "docker rmi ${IMAGE_NAME_PROD}:${env.BUILD_NUMBER.toInteger() - 2} || true"
                    sh "gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev"
                    sh "docker push ${IMAGE_NAME_PROD}:${env.BUILD_NUMBER}"
              } catch (e) {
                    currentBuild.result = "FAILED"
                    notifyBuild(currentBuild.result,'0','0')
                    throw e
                }
            }

            script {
                def commitId = ''
              try{
                  commitId = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                  withCredentials([string(credentialsId: 'gcp-service-account-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                  sh "gcloud run deploy ${CLOUD_RUN_SERVICE_NAME_PRODUCTION} --image ${IMAGE_NAME_PROD}:${env.BUILD_NUMBER} --region ${ARTIFACT_REGISTRY_LOCATION} --platform managed"
                  currentBuild.result = "SUCCESS"
                  notifyBuild(currentBuild.result, commitId, '0')
                }
              } 
              catch (e) {
                currentBuild.result = "FAILED"
                notifyBuild(currentBuild.result,'0','0')
                throw e
              }
            }
          }
    }

   /* stage('Staging') {
        when {
          branch 'staging'
        }        
        steps {
            script {
                        try{
                    notifyBuild('STARTED','0','0')   
                git branch: 'staging', url: 'git@github.com:dnnaeinc/fs-bd-backend.git'
                                            
            }
            
            catch (e) {
                    currentBuild.result = "FAILED"
                    notifyBuild(currentBuild.result,'0','0')
                    throw e
                }
        }

        script {
          try{
              sh "docker build . -t ${IMAGE_NAME_STAGING}:${env.BUILD_NUMBER}"
                // Remove previous image if it exists
              sh "docker rmi ${IMAGE_NAME_STAGING}:${env.BUILD_NUMBER.toInteger() - 2} || true"
              sh "gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev"
              sh "docker push ${IMAGE_NAME_STAGING}:${env.BUILD_NUMBER}"
          } catch (e) {
                currentBuild.result = "FAILED"
                notifyBuild(currentBuild.result,'0')
                throw e
            }

        }
        script {
          def commitId = ''
            try{
              withCredentials([string(credentialsId: 'gcp-service-account-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
              sh "gcloud run deploy ${CLOUD_RUN_SERVICE_NAME_STAGING} --image ${IMAGE_NAME_STAGING}:${env.BUILD_NUMBER} --region ${ARTIFACT_REGISTRY_LOCATION} --platform managed"
              currentBuild.result = "SUCCESSFUL"
              notifyBuild(currentBuild.result, commitId, '0')
              }
            } 
            catch (e) {
              currentBuild.result = "FAILED"
              notifyBuild(currentBuild.result,commitId,'0')
              throw e
            }
        }  
      } 
    }*/
  }
}

def notifyBuild(String buildStatus = 'STARTED',String gitVersion = '0' ,String ecrTaskVersion = '0') {
  buildStatus =  buildStatus ?: 'SUCCESS'
  // Default values
  def colorName = 'RED'
  def colorCode = '#ff0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}] - Git Release -v  ${gitVersion}  '"
  def summary = "${subject} (${env.BUILD_URL})"
  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#ffff00'
  } else if (buildStatus == 'SUCCESS') {
    color = 'GREEN'
    colorCode = '#00ff00'
  } else {
    color = 'RED'
    colorCode = '#ff0000'
  }
  slackSend channel: '#bd-cicd', color: colorCode, iconEmoji: ':factory:', message: summary, teamDomain: 'product-uddann', tokenCredentialId: 'dialer-cicd'
}
