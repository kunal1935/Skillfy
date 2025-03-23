import {clerkClient} from '@clerk/express';

export const upRoleToEduactor = async (req ,res)=>{
    try{
        const userId =res.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role:'eduactor',
            }
        })
        res.json({sucess:true,message:"you can publish a course now"})
    }catch(error){
        res.json({success:false,message:error.message})

    }
    }
 