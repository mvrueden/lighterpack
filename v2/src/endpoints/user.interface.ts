import {ObjectId} from "mongodb";

export interface User {
    id?: ObjectId,
    username : string,
    email : string,
    password : string
}