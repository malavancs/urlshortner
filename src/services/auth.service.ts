import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import DB from '../database';
import { isEmpty } from '../utils/util';

class AuthService {
  public users = DB.Users;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword, photourl: '' });

    return createUserData;
  }

  public async login(userData: any): Promise<{ tokenData: any; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    let findUser: User;
    console.log(userData.isGoogleSignIn);
    if (userData.isGoogleSignIn) {
      const token = userData.password;
      const email = userData.email;
      const name = userData.firstName;
      const photourl = userData.photoUrl;
      findUser = await this.users.findOne({ where: { email: userData.email } });
      if (!findUser) await this.users.create({ email, name, photourl,password:token });
      const { OAuth2Client } = require('google-auth-library');
      const client = new OAuth2Client('437926170744-fujiqam93gfc00qjh9qai4lkqo4do0u4.apps.googleusercontent.com');
      async function verify() {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: '437926170744-fujiqam93gfc00qjh9qai4lkqo4do0u4.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
      }

      try {
        verify()
      } catch (err) {
        throw new HttpException(409, `You're email ${userData.email} not found`);
      }
    } else {
      findUser = await this.users.findOne({ where: { email: userData.email } });
      if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);
  
      const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
      if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");
    }
    

    const tokenData: any = this.createToken(findUser);
    // const cookie = this.createCookie(tokenData);

    return { tokenData, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { password: userData.password } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
