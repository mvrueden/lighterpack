import {collections} from "./database.service"
import {User} from "./user.interface";
import bcrypt from "bcryptjs"
import {ObjectId} from "mongodb";

export async function findById(id: string): Promise<User | null> {
    return collections.users!.findOne({_id: new ObjectId(id)});
}

export const create = async (userData: User) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const userToCreate : User = {
        username : userData.username,
        email : userData.email,
        password: hashedPassword
    };
    return collections.users!.insertOne(userToCreate);
};

export async function findByUsername(username: string) {
    return collections.users!.findOne({username: username});
}

export const findByEmail = async (user_email: string) => {
    return collections.users!.findOne({email: user_email});
};
