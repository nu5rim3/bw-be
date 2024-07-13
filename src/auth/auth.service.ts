import { Inject, Injectable, HttpException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  ChangePasswordCommandInput,
  CognitoIdentityProvider,
  ConfirmSignUpCommandInput,
  ForgotPasswordCommandInput,
  InitiateAuthCommandInput,
  ResendConfirmationCodeCommandInput,
  SignUpCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordDto,
  ConfirmForgotPasswordDto,
  ConfirmSignUpDto,
  ForgotPasswordDto,
  ResendConfirmationCodeDto,
  SignInDto,
  SignUpDto,
} from './dto/auth.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  private cognito: CognitoIdentityProvider;

  constructor(
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.cognito = new CognitoIdentityProvider({
      region: process.env.COGNITO_REGION,
    });
  }

  /**
   * signIn
   * @param SignInDto
   * @returns
   */
  async signIn(signIn: SignInDto) {
    this.logger.info('Sign in request received');
    const param: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: signIn.email,
        PASSWORD: signIn.password,
      },
    };

    try {
      const result = await this.cognito.initiateAuth(param);
      return this.jwtService.sign({
        email: signIn.email,
        token: result.AuthenticationResult.AccessToken,
      });
    } catch (error) {
      error = error as AWS.AWSError;
      this.logger.error(`Sign in failed: ${error.message}`);
      throw new HttpException(
        { message: error.message, code: error.__type || error.code },
        error.$metadata.httpStatusCode || error.statusCode,
      );
    }
  }

  /**
   * signUp
   * @param SignUpDto
   * @returns
   */
  async signUp(signUp: SignUpDto) {
    this.logger.info('Sign up request received');
    const params: SignUpCommandInput = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: signUp.email,
      Password: signUp.password,
      UserAttributes: [{ Name: 'email', Value: signUp.email }],
    };

    try {
      return await this.cognito.signUp(params);
    } catch (error) {
      error = error as AWS.AWSError;
      this.logger.error(`Sign up failed: ${error.message}`);
      throw new HttpException(
        { message: error.message, code: error.__type || error.code },
        error.$metadata.httpStatusCode || error.statusCode,
      );
    }
  }

  /**
   * confirmSignUp
   * @param ConfirmSignUpDto
   * @returns
   */
  async confirmSignUp(confirmSignUpDto: ConfirmSignUpDto) {
    this.logger.info('Confirm sign up request received');
    const params: ConfirmSignUpCommandInput = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      ConfirmationCode: confirmSignUpDto.code,
      Username: confirmSignUpDto.email,
    };

    try {
      await this.cognito.confirmSignUp(params);
      return { message: 'Code validated successfully.' };
    } catch (error) {
      error = error as AWS.AWSError;
      this.logger.error(`Sign up confirmation failed: ${error.message}`);
      throw new HttpException(
        { message: error.message, code: error.__type || error.code },
        error.$metadata.httpStatusCode || error.statusCode,
      );
    }
  }

  /**
   * forgotPassword
   * @param ForgotPasswordDto
   * @returns
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    this.logger.info('Forgot password request received');
    const params: ForgotPasswordCommandInput = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: forgotPasswordDto.email,
    };

    try {
      return this.cognito.forgotPassword(params);
    } catch (error) {
      error = error as AWS.AWSError;
      this.logger.error(`Forgot password failed: ${error.message}`);
      throw new HttpException(
        { message: error.message, code: error.__type || error.code },
        error.$metadata.httpStatusCode || error.statusCode,
      );
    }
  }

  /**
   * confirmForgotPassword
   * @param ConfirmForgotPasswordDto
   * @returns
   */
  async confirmForgotPassword(
    confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ) {
    this.logger.info('Confirm forgot password request received');
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      ConfirmationCode: confirmForgotPasswordDto.code,
      Username: confirmForgotPasswordDto.email,
      Password: confirmForgotPasswordDto.newPassword,
    };

    try {
      return this.cognito.confirmForgotPassword(params);
    } catch (error) {
      error = error as AWS.AWSError;
      this.logger.error(`Confirm forgot password failed: ${error.message}`);
      throw new HttpException(
        { message: error.message, code: error.__type || error.code },
        error.$metadata.httpStatusCode || error.statusCode,
      );
    }
  }

  /**
   * changePassword
   * @param ChangePasswordDto
   * @returns
   */
  async changePassword(changePasswordDto: ChangePasswordDto) {
    this.logger.info('Change password request received');
    const params: ChangePasswordCommandInput = {
      AccessToken: changePasswordDto.AccessToken,
      PreviousPassword: changePasswordDto.oldPassword,
      ProposedPassword: changePasswordDto.newPassword,
    };

    try {
      return this.cognito.changePassword(params);
    } catch (error) {
      error = error as AWS.AWSError;
      this.logger.error(`Change password failed: ${error.message}`);
      throw new HttpException(
        { message: error.message, code: error.__type || error.code },
        error.$metadata.httpStatusCode || error.statusCode,
      );
    }
  }

  /**
   *
   * @param resendConfirmationCodeDto
   * @returns
   */
  async resendConfirmationCode(
    resendConfirmationCodeDto: ResendConfirmationCodeDto,
  ) {
    this.logger.info('Resend confirmation code request received');
    const params: ResendConfirmationCodeCommandInput = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: resendConfirmationCodeDto.email,
    };

    try {
      return this.cognito.resendConfirmationCode(params);
    } catch (error) {
      error = error as AWS.AWSError;
      this.logger.error(`Resend confirmation code failed: ${error.message}`);
      throw new HttpException(
        { message: error.message, code: error.__type || error.code },
        error.$metadata.httpStatusCode || error.statusCode,
      );
    }
  }
}
