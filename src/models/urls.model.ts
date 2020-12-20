import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Url } from '../interfaces/url.interface';

export type UrlCreationAttributes = Optional<Url, "id" | "longUrl" | "shortUrl" | "clicks" | "userId" >;

export class UrlModel extends Model<Url,UrlCreationAttributes> implements Url {
    public longUrl: string;
    public shortUrl: string;
    public clicks: number;
    public userId: number;
    public id : number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
export default function (sequelize: Sequelize): typeof UrlModel {
    UrlModel.init(
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        longUrl: {
          allowNull: false,
          type: DataTypes.STRING(45),
        },
        shortUrl: {
          allowNull: true,
          type: DataTypes.STRING(255),
        },
        clicks: {
          allowNull: true,
          type: DataTypes.NUMBER
        },
        userId: {
          allowNull: false,
          type: DataTypes.NUMBER
        }
      },
      {
        tableName: 'users',
        sequelize,
      },
    );
  
    return UrlModel;
  }