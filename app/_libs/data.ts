import { TTransaction } from "./types";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export async function getOpponents(accessToken: string) {
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/opponents?${query}`);

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const opponentsData = response.json();
  return opponentsData;
}


export async function getTransactions(accessToken: string) {
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions?${query}`);

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const transactionsData = response.json();
  return transactionsData;
}


export async function storeTransaction(transaction: TTransaction, accessToken: string) {
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

  const data = response.json();
  return data;
}


export async function updateTransaction(transaction: TTransaction, accessToken: string) {
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions/${transaction.id}?${query}`, {
    method: "PUT",
    body: JSON.stringify(transaction),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}


export async function batchSettleTransaction(ids: Array<Number>, accessToken: string) {
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions/batch-settle?${query}`, {
    method: "POST",
    body: JSON.stringify({ ids }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}


export async function deleteTransaction(transaction: TTransaction, accessToken: string) {
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


export async function batchDeleteTransaction(ids: Array<Number>, accessToken: string) {
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions/batch-delete?${query}`, {
    method: "POST",
    body: JSON.stringify({ ids }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}
