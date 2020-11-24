const {db ,Posts}=require('../db');


async function createPost(userId,notes){

    const post = await Posts.create({
       notes,
        userId
    })
return post;


}

async function showAllPosts(userId){
const post=await Posts.findAll({
    where:{
        userId
    }
})
return post;
}

module.exports={
    createPost,
    showAllPosts
}