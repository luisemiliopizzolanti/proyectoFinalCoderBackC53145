import { userModel } from "../models/user.model.js";

export class UserManagerMongo{
    constructor(){
        this.model=userModel
    }

    async add(newUser){
        return await this.model.create(newUser)
    }

    async delete(userToDelete){
        return await this.model.findByIdAndDelete(userToDelete);
    }

    async update(userToUpdate){
        return await this.model.findByIdAndUpdate(id, userToUpdate, { new: true });
    }

    async get(userToGet){
        return await this.model.findOne(userToGet)
    }
}