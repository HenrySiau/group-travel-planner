import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
var Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        maxlength: 100,
        required: true
    },
    email: {
        type: String,
        maxlength: 100,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        maxlength: 30
    },
    password: {
        type: String,
        maxlength: 300,
        required: true
    },
    profilePhoto: {
        type: String,
        maxlength: 300
    },
    created: {
        type: Date,
        default: Date.now
    },
    isSocialAuth: {
        type: Boolean,
        default: false
    }
});
//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});
//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({
            email: email
        })
        .exec(function (err, user) {
            if (err) {
                return callback(err);
            } else if (!user) {
                var err401 = new Error('User not found.');
                err.status = 401;
                return callback(err401);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
};

const TripSchema = new Schema({
    name: String,
    description: String,
    profilePhoto: String,
    menbers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    administrators: Array,
    photos: Array,
    created: {
        type: Date,
        default: Date.now
    },
    isActive: Boolean,
    invitationCode: String
});

const IdeaSchema = new Schema({
    title: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    comments: Array,
    peopleLiked: Array,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

const MessageSchema = new Schema({
    body: String,
    creator: String,

    comments: Array,
    peopleLiked: Array
});

const kittySchema = new Schema({
    name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);
const User = mongoose.model('User', UserSchema);
const Trip = mongoose.model('Trip', TripSchema);
const Idea = mongoose.model('Idea', IdeaSchema);
const Message = mongoose.model('Message', MessageSchema);



export {
    Kitten,
    User,
    Trip,
    Idea,
    Message
};