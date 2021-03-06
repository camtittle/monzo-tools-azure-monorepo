terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      # Root module should specify the maximum provider version
      # The ~> operator is a convenient shorthand for allowing only patch releases within a specific minor release.
      version = "~> 2.26"
    }
  }
}

provider "azurerm" {
  features {}
}

locals {
  cosmosdb_db_name                     = "monzodb"
  cosmosdb_transactions_container_name = "transactions"
  cosmosdb_summaries_container_name    = "summaries"
}

resource "azurerm_resource_group" "resource_group" {
  name     = "${var.project}-${var.environment}-rg"
  location = var.location
}

resource "azurerm_storage_account" "storage_account" {
  name                     = "${var.project}${var.environment}sa"
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_application_insights" "application_insights" {
  name                = "${var.project}-${var.environment}-application-insights"
  location            = var.location
  resource_group_name = azurerm_resource_group.resource_group.name
  application_type    = "Node.JS"
}

resource "azurerm_app_service_plan" "app_service_plan" {
  name                = "${var.project}-${var.environment}-asp"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = var.location
  kind                = "FunctionApp"
  reserved            = true # this has to be set to true for Linux. Not related to the Premium Plan
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_function_app" "function_app" {
  name                = "${var.project}-${var.environment}-function-app"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = var.location
  app_service_plan_id = azurerm_app_service_plan.app_service_plan.id
  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE"        = ""
    "FUNCTIONS_WORKER_RUNTIME"        = "node"
    "APPINSIGHTS_INSTRUMENTATIONKEY"  = azurerm_application_insights.application_insights.instrumentation_key
    "CosmosDbConnectionString"        = azurerm_cosmosdb_account.acc.connection_strings.0
    "StorageAccountConnectionString"  = azurerm_storage_account.storage_account.primary_connection_string
    "TransactionQueueName"            = azurerm_storage_queue.transactions.name
    "CosmosDbName"                    = local.cosmosdb_db_name
    "CosmosDbCollectionName"          = local.cosmosdb_transactions_container_name
    "CosmosDbSummariesCollectionName" = local.cosmosdb_summaries_container_name
  }
  os_type = "linux"
  site_config {
    linux_fx_version          = "node|14"
    use_32_bit_worker_process = false
  }
  storage_account_name       = azurerm_storage_account.storage_account.name
  storage_account_access_key = azurerm_storage_account.storage_account.primary_access_key
  version                    = "~3"

  lifecycle {
    ignore_changes = [
      app_settings["WEBSITE_RUN_FROM_PACKAGE"],
    ]
  }
}



# Database

resource "azurerm_cosmosdb_account" "acc" {
  name                = "${var.project}-${var.environment}-cdbacc"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableServerless"
  }
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = local.cosmosdb_db_name
  resource_group_name = azurerm_cosmosdb_account.acc.resource_group_name
  account_name        = azurerm_cosmosdb_account.acc.name
}

resource "azurerm_cosmosdb_sql_container" "transactions" {
  name                = local.cosmosdb_transactions_container_name
  resource_group_name = azurerm_cosmosdb_account.acc.resource_group_name
  account_name        = azurerm_cosmosdb_account.acc.name
  database_name       = azurerm_cosmosdb_sql_database.db.name
  partition_key_path  = "/accountId"
}

resource "azurerm_cosmosdb_sql_container" "summaries" {
  name                = local.cosmosdb_summaries_container_name
  resource_group_name = azurerm_cosmosdb_account.acc.resource_group_name
  account_name        = azurerm_cosmosdb_account.acc.name
  database_name       = azurerm_cosmosdb_sql_database.db.name
  partition_key_path  = "/accountId"
}

#??Queue

resource "azurerm_storage_queue" "transactions" {
  name                 = "${var.project}${var.environment}transactionsqueue"
  storage_account_name = azurerm_storage_account.storage_account.name
}
