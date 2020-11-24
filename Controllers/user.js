const {db ,Users}=require('../db');
const  bcrypt=require('bcryptjs')


async function createUser(username,password,email){

    const user=await Users.findOne({where:{
        username 
     }})
      
     if(user){
         
         throw new Error("user already exist");
     }
     else{
        const hash=await bcrypt.hash(password,8);
        
        const userad= await  Users.create({
            username:username,
            email:email,
            password:hash
        })
         return true;
     }



        }
        module.exports={
            createUser
        };



































