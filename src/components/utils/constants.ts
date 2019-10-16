export enum CHART_STAGES {
  INGEST = 'ingest',
  DEDUPE = 'dedupe',
  VALIDATE = 'validate',
  STANDARDIZE = 'standardize',
  FORMAT = 'format',
  APPEND = 'append',
  UPLOAD = 'upload'
}

export enum SERVER_CONFIG {
  DEV = 'https://otobots.otomashen.com:6969',
  PROD = ''
}

export enum METHOD {
  GET = 'GET',
  POST = 'POST'
}

export const HOST = SERVER_CONFIG.DEV;

export enum API_ENDPOINTS {
  LOGIN = '/client/login',
  GET_ALL_TRANSACTIONS = '/transaction/getAllTransactions',
  GET_TRANSACTION_DETAILS = '/transaction/getDetails',
  POST_TRANSACTION = '/client/postTransaction',
  DOWNLOAD_TRANSACTION = '/client/downloadFile'
}
