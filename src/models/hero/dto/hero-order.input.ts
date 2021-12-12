import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../../shared/functions/order';

export enum HeroOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  realName = 'realName',
  alterEgo = 'alterEgo',
  usersVoted = 'usersVoted',
}

registerEnumType(HeroOrderField, {
  name: 'HeroOrderField',
  description: 'Properties by which hero connections can be ordered.',
});

@InputType()
export class HeroOrder extends Order {
  field: HeroOrderField;
}
