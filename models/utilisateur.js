const mongoose = require ("mongoose")

const bcrypt = require("bcrypt");

const utilisateurS = new mongoose.Schema({

    nom: {
        type: String,
        required: true,
        trim: true
    },
        
    telephone:{
        type: Number,
        required: true,
        unique: true
    },
        
    adresse:{
        type:String,
        required: true,
        trim: true
        
    },

    password: {
        type: String,
        required: true
    }


});

utilisateurS.pre("save", async function(){
    if (!this.isModified("password")){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
});

module.exports= mongoose.model("utilsateur",utilisateurS);



