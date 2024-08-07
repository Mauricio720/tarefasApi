import { AuthenticateGenerateToken } from 'application/security/Authenticator';
import { CheckPassword } from 'application/security/Encrypt';
import { AuthenticateInvalid } from "domain/errors/AuthenticateInvalid";
import { UserRepository } from 'domain/repository/UserRepository';

export class AuthenticateUser{
  constructor(
    private readonly userRepository:UserRepository,
    private readonly encrypt:CheckPassword,
    private readonly authenticator:AuthenticateGenerateToken
  ){}

  async execute(input:InputAuthenticateUser):Promise<OutputAuthenticateUser>{
    try{
      const user = await this.userRepository.findByEmail(input.email)
      if(!user){
        throw new AuthenticateInvalid()
      }
      const isValidPassword = this.encrypt.check(input.password,user.getEncryptedPassword())
      if(!isValidPassword){
        throw new AuthenticateInvalid()  
      }
      const token = this.authenticator.generateToken({
        id: user.getId(),
        email: user.getEmail()
      })
      return {
        token,
        user:{
          id: user.getId(),
          email: user.getEmail()
        }
      }

    }catch(error){
      throw new AuthenticateInvalid()
    }
  }
}

export type InputAuthenticateUser={
  email: string;
  password: string;
}

export type OutputAuthenticateUser={
  token: string;
  user:{
    id: string;
    email: string
  }
}