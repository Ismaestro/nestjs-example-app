import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { UserEntity } from './user.decorator';
import { User } from './shared/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UserService } from 'src/models/user/user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { GraphqlAuthGuard } from '../../authentication/graphql-auth.guard';
import {Hero} from '../hero/hero.model';
import {HeroIdArgs} from '../hero/dto/hero-id.args';

@Resolver(() => User)
@UseGuards(GraphqlAuthGuard)
export class UserResolver {
  private logger = new Logger('UserResolver');

  constructor(private userService: UserService) {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    this.logger.verbose(`User "${user.email}" retrieving himself.`);
    return user;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput
  ) {
    return this.userService.updateUser(user.id, newUserData);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Hero)
  async removeHero(
      @UserEntity() user: User,
      @Args() heroIdArgs: HeroIdArgs
  ) {
    return this.userService.removeHero(user, heroIdArgs);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.userService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }

  @ResolveField('heroes')
  heroes(@Parent() author: User) {
    return this.userService.getHeroes(author);
  }
}
