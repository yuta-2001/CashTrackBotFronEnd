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
  'profile_image': string,
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
