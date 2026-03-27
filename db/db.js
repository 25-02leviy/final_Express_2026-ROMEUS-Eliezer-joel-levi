const mongoose = require("mongoose");



const Konekte = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connexion Reussi");
    }catch(error){
        console.log("ERROR :", error.message);
    }
    
};

module.exports= Konekte;


// {
//   "nom": "Romeus Eliezer",
//   "telephone": 36334731,
//   "adresse": "pignon",
//   "password": "Passssss1!"
// }

//http://localhost:2502/api/utilisateur/add
