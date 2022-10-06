const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    // emailConfirm: { type: Boolean, default: false },
    age: { type: Number, required: true },
    sexo: {
      type: String,
      enum: ["Feminino", "Masculino", "Outros"],
      required: true,
    },
    dataNasc: { type: String, required: true },
    passwordHash: { type: String, required: true },
    orientacaoSexual: {
      type: String,
      enum: [
        "Héterosexual",
        "Gay",
        "Lésbica",
        "Bissexual",
        "Assexual",
        "Demisexual",
        "Pansexual",
        "Queer",
        "Outro",
      ],
      required: true,
    },
    cidade: {
      type: String,
      enum: [
        "Acre AC",
        "Alagoas AL",
        "Amapá AP",
        "Amazonas AM",
        "Bahia BA",
        "Ceará CE",
        "Distrito Federal DF",
        "Espírito Santo ES",
        "Goiás GO",
        "Maranhão MA",
        "Mato Grosso MT",
        "Mato Grosso do Sul MS",
        "Minas Gerais MG",
        "Pará PA",
        "Paraíba PB",
        "Paraná PR",
        "Pernambuco PE",
        "Piauí PI",
        "Rio de Janeiro RJ",
        "Rio Grande do Norte RN",
        "Rio Grande do Sul RS",
        "Rondônia RO",
        "Roraima RR",
        "Santa Catarina SC",
        "São Paulo SP",
        "Sergipe SE",
        "Tocantins TO",
      ],
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
    },
    statusRel: {
      type: String,
      enum: [
        "Solteiro",
        "Noivo",
        "Casado",
        "Enrolado",
        "Relacionamento monogâmico",
        "Relacionamento não monogâmico",
        "Poliamor",
        "Noivo",
      ],
      required: true,
    },
    mostrar: { type: String, enum: ["Masculino", "Feminino", "Todos"] },
    interesses: [
      {
        type: String,
        required: true,
      },
    ],
    bio: { type: String, minlength: 10, maxlength: 500 },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
