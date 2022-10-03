const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    age: { type: Number, required: true },
    sexo: { type: String, enum: ["Feminino", "Masculino", "Outros"] },
    dataNasc: { type: Date },
    orientacaoSexual: {
      type: String,
      enum: [
        "heterosexual",
        "gay",
        "lesbica",
        "bissexual",
        "assexual",
        "demissexual",
        "pansexual",
        "queer",
        "outro",
      ],
    },
    cidade: {
      type: String,
      required: true,
      enum: [
        "Acre (AC)",
        "Alagoas (AL)",
        "Amapá (AP)",
        "Amazonas (AM)",
        "Bahia (BA)",
        "Ceará (CE)",
        "Distrito Federal (DF)",
        "Espírito Santo (ES)",
        "Goiás (GO)",
        "Maranhão (MA)",
        "Mato Grosso (MT)",
        "Mato Grosso do Sul (MS)",
        "Minas Gerais (MG)",
        "Pará (PA)",
        "Paraíba (PB)",
        "Paraná (PR)",
        "Pernambuco (PE)",
        "Piauí (PI)",
        "Rio de Janeiro (RJ)",
        "Rio Grande do Norte (RN)",
        "Rio Grande do Sul (RS)",
        "Rondônia (RO)",
        "Roraima (RR)",
        "Santa Catarina (SC)",
        "São Paulo (SP)",
        "Sergipe (SE)",
        "Tocantins (TO)",
      ],
    },
    profilePic: {
      type: String,
      default:
        "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
    },
    statusRel: {
      type: String,
      enum: [
        "solteiro",
        "casado",
        "enrolado",
        "ficando",
        "relacionamento monogamico",
        "relacionamento não monogamico",
        "poliamor",
        "noivo",
      ],
    },
    mostrar: { type: String, enum: ["Masculino", "Feminino", "Todos"] },
    interesses: {
      type: String,
      enum: [
        "back-end",
        "front-end",
        "soft-skills",
        "hard-skills",
        "full-stack",
        "ux-ui",
        "web-dev",
        "data-analytics",
        "cybersecurity",
      ],
    },
    // bio: "",
    // chats: [ref: chat],
    // posts: [ref: posts]
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
