export type TUser = {
  'name': string,
  'profile_image': string,
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

export type TOpponent = {
  'id': number,
  'name': string,
}
