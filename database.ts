import { Collection, MongoClient, WithId } from 'mongodb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Root, User, Video } from './types';

dotenv.config();
const uri: string = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const collectionvideos: Collection<Video> = client.db("exercises").collection<Video>("youtube");
const collectionusers: Collection<User> = client.db("exercises").collection<User>("youtube-users");


const saltRounds : number = 10;

async function startUp(){
    const resp = await fetch("https://raw.githubusercontent.com/similonap/json/master/videos.json");
    const data: Root = await resp.json();
    const videoArray: Video[] = data.videos;
    console.log(videoArray);
    const amount : number = await collectionvideos.countDocuments();
    const amountOfUsers: number = await collectionusers.countDocuments();
    
    if(amount===0){
        await collectionvideos.insertMany(videoArray);
    }else if (process.env.CLEAR_DB_ON_RESTART){
        await collectionvideos.deleteMany();
        await collectionvideos.insertMany(videoArray);
    };
    if(amountOfUsers != 2){
        await collectionusers.deleteMany();
        await addUser("admin","admin1234");
        await addUser("user","user1234");
    }

}

export async function tryLogin(user:User){
    const userDatabase: WithId<User> | null = await collectionusers.findOne({username : user.username});
    if(userDatabase){
        if(await bcrypt.compare(user.password, userDatabase.password)){
            return userDatabase;
        }
    }
    return undefined;
}

export async function addUser(name:string, password:string){

    const user: User = {
        username:name,
        password: await bcrypt.hash(password,saltRounds),
    }

    await collectionusers.insertOne(user);
}

async function exit(){
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }finally{
        process.exit(0);
    }
}

export async function connect(){
    try {
        await startUp()
        await client.connect();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }

}