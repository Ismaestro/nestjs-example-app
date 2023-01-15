import { Auth } from './auth.model';
import { Token } from './token.model';
import { LoginInput } from './dto/login.input';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { GraphqlAuthGuard } from './graphql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { OkResponse } from '../shared/models/ok-response.model';
import { UserEntity } from '../models/user/user.decorator';
import { DeleteAccountArgs } from './dto/delete-account.args';
import { Language, User } from '@prisma/client';
import { I18n, I18nContext } from 'nestjs-i18n';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput, @I18n() i18n: I18nContext) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.authService.signup(
      data,
      i18n.lang as Language
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.authService.login(
      email.toLowerCase(),
      password
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.authService.refreshToken(token);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => OkResponse)
  async deleteAccount(@UserEntity() user: User, @Args() { password }: DeleteAccountArgs) {
    return this.authService.deleteAccount(user, password);
  }

  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    return await this.authService.getUserFromToken(auth.accessToken);
  }
}
