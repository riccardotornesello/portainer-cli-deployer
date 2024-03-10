1. Add pipeline to build

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    - mkdir -p /kaniko/.docker
    - echo "{\"auths\":{\"${CI_REGISTRY}\":{\"username\":\"${CI_REGISTRY_USER}\",\"password\":\"${CI_REGISTRY_PASSWORD}\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor
      --context ${CI_PROJECT_DIR}
      --dockerfile ${CI_PROJECT_DIR}/Dockerfile
      --destination ${CI_REGISTRY_IMAGE}:${CI_COMMIT_BRANCH}
  rules:
    - if: '$CI_COMMIT_BRANCH == "dev"'
```

2. Register stack on portainer

```
yarn run dev
```

3. Update pipeline to deploy

```
deploy-staging:
  stage: deploy
  image: quay.io/curl/curl:latest
  variables:
    GIT_STRATEGY: none
  script:
    - "curl -X POST --insecure https://192.168.1.13:9443/api/stacks/webhooks/XXXXXXXXXXXXXXXXXXXXX"
  rules:
    - if: '$CI_COMMIT_BRANCH == "dev"'
```
