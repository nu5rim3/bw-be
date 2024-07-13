import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmSignUpDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'User successfully signed in.' })
  @ApiOperation({ summary: 'Sign in  user.' })
  async signin(@Body() signInDto: SignInDto) {
    this.logger.info('Sign in request received');
    return await this.authService.signIn(signInDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: 'User successfully signed up.' })
  @ApiOperation({ summary: 'Sign up a new user.' })
  async signup(@Body() signUpDto: SignUpDto) {
    this.logger.info('Sign up request received');
    return await this.authService.signUp(signUpDto);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ConfirmSignUpDto })
  @ApiResponse({ status: 200, description: 'User successfully confirmed.' })
  @ApiOperation({ summary: 'Confirm a user.' })
  async confirm(@Body() confirmSignUpDto: ConfirmSignUpDto) {
    this.logger.info('Confirm request received');
    return await this.authService.confirmSignUp(confirmSignUpDto);
  }
}
