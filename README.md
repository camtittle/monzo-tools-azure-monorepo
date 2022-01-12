# monzo-tools-monorepo

A sandbox project to try out a few things including:

* Node on Azure functions using Azure Functions Core Tools & webpack
* Typescript monorepo using yarn workspaces and typescript references
* Monzo API

## Set up

Following tools are required:

* Azure Functions Core Tools
* Yarn 2

## Deploy

### Terraform

```
cd terraform
terraform init
terraform apply -auto-approve
```

## Azure Functions

Get the `functionAppName` from the Terraform outputs.

```
cd packages/azure-functions
yarn run build
func azure functionapp publish {functionAppName}
```
