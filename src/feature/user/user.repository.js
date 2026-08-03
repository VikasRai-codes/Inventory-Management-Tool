import {getDB} from '../../config/db.js';
import { ApplicationError } from "../../errorHandling/applicationErrorHandling.js";

// const UserModel = mongoose.model('user', userSchema);

export default class UserRepository {

    async signUp(user){
        try{
            // inset user into database

            const newUser = await getDB().query(
            `INSERT INTO users (name, email, type, password)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, type`,
            [user.name, user.email, user.type, user.password]
        );
            return newUser;
        }catch(err){
            throw new ApplicationError(err.detail, err.code = 409);
        }
    }

    async findByEmail(email){
        try{
           const user = await getDB().query( "SELECT id, email FROM users WHERE email = $1",
                [email]
            );

            if(user.rows.length === 0){
             return null;
            }

            return user.rows[0];
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
}