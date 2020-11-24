const Sequelize=require("sequelize");

const db=new Sequelize({
    dialect:'sqlite',
    storage:__dirname+'/userlogin.db'
})

const Users=db.define('user',{
    id:{
        type:Sequelize.DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
type:Sequelize.DataTypes.STRING(49),
allowNull:false,
unique:true
    },
    password:{
        type:Sequelize.DataTypes.STRING(260),
        allowNull:false
    },
    email:{
        type:Sequelize.DataTypes.STRING(50),
        allowNull:false
    }
})



const Posts=db.define('post',{
 id:{
    type:Sequelize.DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
},
notes:{
    type:Sequelize.DataTypes.TEXT('long'),
    allowNull:false
}
  })

Users.hasMany(Posts);
Posts.belongsTo(Users);



module.exports={
    db,Users,Posts
}