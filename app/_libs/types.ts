import { TransactionType, CalculateTransactionType } from './enums';

export type TOpponent = {
  'id': number,
  'name': string,
}

export type TTransaction = {
  'id': number,
  'opponent_id': number,
  'is_settled': boolean,
  'type': number,
  'name': string,
  'amount': number,
  'memo': string | null,
}

export type TUser = {
  'name': string,
  'pictureUrl': string | undefined,
}

export type TCalculateResult = {
  'name': string,
  'amount': number,
  'type': CalculateTransactionType,
}

export type TSearchCondition = {
  'type': TTypeSelect,
  'opponent': TOpponentSelect,
  'isSettled': boolean,
}

export type TTypeSelect = 'all' | TransactionType.Lend | TransactionType.Borrow;

export type TOpponentSelect = 'all' | number;

export type TTransactionForm = {
  'opponent_id': number,
  'type': TransactionType,
  'is_settled': boolean,
  'name': string,
  'amount': number,
  'memo': string | null,
}


export type TToastInfo = {
  'message': string,
  'type': 'success' | 'error',
}

export type TBillInfo = {
  'opponent_id': number,
  'opponent_name': string,
  'amount': number,
  'borrow_amount': number,
  'lend_amount': number,
}
