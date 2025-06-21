import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt: Date
}


const MessageSchema: Schema<Message> = new Schema({
         
    content:{
        type:String,
        required:true
    },
    createdAt: {
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptedMessage:boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({

    username:{
        type:String,
        required:[true, "username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required: [true, "email is required"],
        match: [/.+\@.+\..+/, "please enter a valid email address"]
    },
    password:{
        type:String,
        required: [true, "password is required"],
        
    },
    verifyCode:{
        type:String,
        required:[true, "verify Code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        reuired: [true, "verify Code Expiry is must"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptedMessage:{
        type:Boolean,
        reuired:true
    },
    messages: [MessageSchema]
})

const UserModel  = (mongoose.models.User as mongoose.Model<User>) || mongoose.model("User",UserSchema)

export default UserModel;