import { TTransaction, TTransactionForm } from "./types";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

async function getAccessToken(liff: any) {
  const accessToken = await liff.getAccessToken();

  if (!accessToken) {
    throw new Error("Access token not found");
  }

  return accessToken;
}

export async function getOpponents(liff: any) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/opponents?${query}`);

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const opponents = await response.json();
  return opponents.data;
}


export async function getTransactions(liff: any) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions?${query}`);

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const transactions = await response.json();
  return transactions.data;
}


export async function storeTransaction(transaction: any, liff: any) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions?${query}`, {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const createdTransaction = await response.json();
  return createdTransaction.data;
}


export async function updateTransaction(transactionId: number, transaction: TTransactionForm, liff: any): Promise<TTransaction> {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions/${transactionId}?${query}`, {
    method: "PUT",
    body: JSON.stringify(transaction),
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    mode: 'cors'
  });

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const updatedTransaction = await response.json();
  return updatedTransaction.data;
}


export async function batchSettleTransaction(ids: Array<Number>, liff: any) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions/batch-settle?${query}`, {
    method: "PUT",
    body: JSON.stringify({ ids: ids }),
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    mode: 'cors'
  });

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}


export async function deleteTransaction(transaction: TTransaction, liff: any) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions/${transaction.id}?${query}`, {
    method: "DELETE",
  });

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}


export async function batchDeleteTransaction(ids: Array<Number>, liff: any) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions/batch-delete?${query}`, {
    method: "POST",
    body: JSON.stringify({ ids: ids }),
    headers: {
      "Content-Type": "application/json",
    },
    mode: 'cors',
  });

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}
