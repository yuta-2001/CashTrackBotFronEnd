import { Liff } from "@line/liff";
import { TTransaction, TTransactionForm, TBillInfo } from "./types";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

type AccessTokenCache = {
  token: string | null;
  timestamp: number | null;
};

let accessTokenCache: AccessTokenCache = {
  token: null,
  timestamp: null
};

// liffアプリを閉じ、LINEのトーク画面に遷移させる
// また、トーク画面にエラーを通知する
function errorHandler(liff: Liff) {
  liff.sendMessages([{
    type: 'text',
    text: 'アプリケーションでエラーが発生しました。\n時間をおいて再度お試しください。'
  }]).then(() => {
    liff.closeWindow();
    console.log("message sent");
  })
  .catch((err) => {
    console.log("error", err);
  });
}

async function getAccessToken(liff: Liff, cacheDuration = 300000) {
  const currentTime = new Date().getTime();

  if (accessTokenCache.token && accessTokenCache.timestamp && (currentTime - accessTokenCache.timestamp) < cacheDuration) {
    return accessTokenCache.token;
  }

  const accessToken = await liff.getAccessToken();

  if (!accessToken) {
    errorHandler(liff);
    throw new Error("Access Token Error");
  }

  accessTokenCache = {
    token: accessToken,
    timestamp: currentTime
  };

  return accessToken;
}


export async function getOpponents(liff: Liff) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/opponents?${query}`);

  if (response.status !== 200) {
    errorHandler(liff);
    throw new Error("API Error");
  }

  const opponents = await response.json();
  return opponents.data;
}


export async function storeOpponent(opponent: any, liff: Liff) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/opponents?${query}`, {
    method: "POST",
    body: JSON.stringify(opponent),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    errorHandler(liff);
    throw new Error("API Error");
  }

  const createdOpponent = await response.json();
  return createdOpponent.data;
}


export async function updateOpponent(opponentId: number, opponent: any, liff: Liff) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/opponents/${opponentId}?${query}`, {
    method: "PUT",
    body: JSON.stringify(opponent),
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    mode: 'cors'
  });

  if (response.status !== 200) {
    errorHandler(liff);
    throw new Error("API Error");
  }

  const updatedOpponent = await response.json();
  return updatedOpponent.data;
}


export async function deleteOpponent(opponent: any, liff: Liff) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/opponents/${opponent.id}?${query}`, {
    method: "DELETE",
  });

  if (response.status !== 200) {
    errorHandler(liff);
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}


export async function getTransactions(liff: Liff) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions?${query}`);

  if (response.status !== 200) {
    errorHandler(liff);
    throw new Error("API Error");
  }

  const transactions = await response.json();
  return transactions.data;
}


export async function storeTransaction(transaction: any, liff: Liff) {
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
    errorHandler(liff);
    throw new Error("API Error");
  }

  const createdTransaction = await response.json();
  return createdTransaction.data;
}


export async function updateTransaction(transactionId: number, transaction: TTransactionForm, liff: Liff): Promise<TTransaction> {
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
    errorHandler(liff);
    throw new Error("API Error");
  }

  const updatedTransaction = await response.json();
  return updatedTransaction.data;
}


export async function batchSettleTransaction(ids: Array<Number>, liff: Liff) {
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
    errorHandler(liff);
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}


export async function deleteTransaction(transaction: TTransaction, liff: Liff) {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions/${transaction.id}?${query}`, {
    method: "DELETE",
  });

  if (response.status !== 200) {
    errorHandler(liff);
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}


export async function batchDeleteTransaction(ids: Array<Number>, liff: Liff) {
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
    errorHandler(liff);
    throw new Error("API Error");
  }

  const data = response.json();
  return data;
}


export async function generateTransactionsBill(billInfo: TBillInfo, liff: Liff): Promise<string> {
  const accessToken = await getAccessToken(liff);
  const params = {accessToken : accessToken};
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_DOMAIN}/api/liff/transactions/generate-bill?${query}`, {
    method: "POST",
    body: JSON.stringify(billInfo),
    headers: {
      "Content-Type": "application/json",
    },
    mode: 'cors',
  });

  if (response.status !== 200) {
    errorHandler(liff);
    throw new Error("API Error");
  }

  const generateTransactionsBill = await response.json();
  return generateTransactionsBill.data.url;
}
