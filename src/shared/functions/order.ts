import { Field, InputType } from '@nestjs/graphql';
import { OrderDirectionEnum } from '../enums/order-direction.enum';

@InputType({ isAbstract: true })
export abstract class Order {
  @Field(() => OrderDirectionEnum)
  direction: OrderDirectionEnum;
}
