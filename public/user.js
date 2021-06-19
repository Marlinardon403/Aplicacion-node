const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 5;

//schema a utilizar
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true }
});

//funcion para encriptar password
userSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
        const document = this;
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if(err){
            next(err);
            } else {
                document.password = hashedPassword;
                next();
            }
        });
    }else{
        next();
    }
});

//funcion para comparar password con el de la base de datos

userSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same){
    if(err){
        callback(err);
    }else{
        callback(err, same);
    }
});
}

module.exports = mongoose.model('User', userSchema);