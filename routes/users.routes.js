const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
      name: { type: String, required: true },
      email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        age: { type: Number, required: true},
        sexo: { type: String, required: true},
        dataNasc: { type: Date, default: Date.now()},
        orientacaoSexual: { type: String, required: true},
        cidade: { type: String, required: true}
      },
      posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    },
    {
      timestamps: true
    }
  );
  
  const UserModel = mongoose.model("User", UserSchema);
  
  module.exports = UserModel;