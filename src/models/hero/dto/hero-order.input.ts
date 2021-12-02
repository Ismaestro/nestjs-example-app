import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../order/order';

export enum HeroOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  realName = 'realName',
  alterEgo = 'alterEgo',
}

registerEnumType(HeroOrderField, {
  name: 'HeroOrderField',
  description: 'Properties by which hero connections can be ordered.',
});

@InputType()
export class HeroOrder extends Order {
  field: HeroOrderField;
}
