import { TUser } from '../_types/TUser';
import { TTransaction } from '../_types/TTransaction';
import { TOpponent } from '../_types/TOpponent';

const user: TUser = {
  'name': 'Yuta',
  'profile_image': 'aaa',
}


const transactions: TTransaction[] = [
  {
    'id': 1,
    'opponent_id': 1,
    'opponent_name': 'John',
    'is_settled': false,
    'type': 1,
    'name': 'Lunch with John',
    'amount': 10,
    'memo': null,
  },
  {
    'id': 2,
    'opponent_id': 2,
    'opponent_name': 'Jane',
    'is_settled': false,
    'type': 2,
    'name': 'Dinner with Jane',
    'amount': 20,
    'memo': null,
  },
  {
    'id': 3,
    'opponent_id': 3,
    'opponent_name': 'Jack',
    'is_settled': false,
    'type': 1,
    'name': 'Dinner with Jack',
    'amount': 20,
    'memo': null,
  },
  {
    'id': 4,
    'opponent_id': 1,
    'opponent_name': 'John',
    'is_settled': true,
    'type': 2,
    'name': 'Dinner with John',
    'amount': 20,
    'memo': null,
  },
  {
    'id': 5,
    'opponent_id': 2,
    'opponent_name': 'Jane',
    'is_settled': true,
    'type': 1,
    'name': 'Morning coffee',
    'amount': 20,
    'memo': null,
  },
  {
    'id': 6,
    'opponent_id': 3,
    'opponent_name': 'Jack',
    'is_settled': true,
    'type': 2,
    'name': 'Dinner',
    'amount': 2000,
    'memo': 'aaa',
  },
];


const opponents: TOpponent[] = [
  {
    'id': 1,
    'name': 'John',
  },
  {
    'id': 2,
    'name': 'Jane',
  },
  {
    'id': 3,
    'name': 'Jack',
  }
];

export { user, transactions, opponents };
