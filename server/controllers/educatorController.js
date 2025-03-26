import { clerkClient } from "@clerk/express"


export const updateRoletoEducator = async ()=>{
    try{
        const userId =req.auth.userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role:'educator',
            }
        })

        res.json({sucess:true, message:"You can publish a course now"})

    } catch(error){
        res.json({success:false, message:error.message})

}
}

