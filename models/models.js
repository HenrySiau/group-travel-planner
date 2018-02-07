import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  profilePhoto: String,
  created: { type: Date, default: Date.now },
  isSocialAuth: { type: Boolean, default: false }
});

const tripSchema = new Schema({
  name: String,
  description: String,
  profilePhoto: String,
  menbers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  administrators: Array,
  photos: Array,
  created: { type: Date, default: Date.now },
  isActive: Boolean,
  invitationCode: String
});

const ideaSchema = new Schema({
  title: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  body: String,
  comments: Array,
  peopleLiked: Array,
  created: { type: Date, default: Date.now },
  updated: Date
});

// const messageSchema = new Schema({
//   body: String,
//   creator: String,
  
//   comments: Array,
//   peopleLiked: Array
// });

const kittySchema = new Schema({
  name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);


export {
  Kitten
};