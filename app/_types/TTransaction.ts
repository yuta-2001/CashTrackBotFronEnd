export type TTransaction = {
  'id': number,
  'opponent_id': number,
  'opponent_name': string,
  'is_settled': boolean,
  'type': number,
  'name': string,
  'amount': number,
  'memo': string | null,
}
