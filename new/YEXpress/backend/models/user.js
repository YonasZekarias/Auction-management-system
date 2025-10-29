const mongoose =require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    userename : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['admin', 'customer'],
        default : 'customer'
    },
    deleted : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

    
module.exports = mongoose.model('User', userSchema)