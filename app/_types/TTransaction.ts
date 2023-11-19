export type TTransaction = {
  'id': number,
  'opponent_id': number,
  'is_settled': boolean,
  'type': number,
  'name': string,
  'amount': number,
  'memo': string | null,
}
