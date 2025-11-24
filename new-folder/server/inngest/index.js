import { Inngest } from 'inngest';

// Create Inngest client
export const inngest = new Inngest({
  id: "pingup-app",
  name: "PingUp Application"
});
const syncUserCreation = inngest.createFunction(
    {id:"sync-user-from-clerk"},
    {event:'clerk/user.created'},
    async({event})=>{
        const{id,first_name,last_name,email_address,image_url}=event.data;
        const username = email_address[0].email_address.split('@')[0]
        const user =  await user.findOne({username})
        if(user){
          username = username+Math.floor(Math.random()*10000);
        }
        const userData = {
          _id:id,
          email_address:email_address[0].email_address,
          full_name: first_name+" "+last_name,
          profile_picture:image_url,
          username
        }
        await user.create(userData)
    }
)
// update function
const syncUserUpdation = inngest.createFunction(
    {id:"update-user-from-clerk"},
    {event:'clerk/user.updated'},
    async({event})=>{
        const{id,first_name,last_name,email_address,image_url}=event.data;
        const user =  await user.findOne({username})
        if(user){
          username = username+Math.floor(Math.random()*10000);
        }
        const UpdatedUserData = {
          email_address:email_address[0].email_address,
          full_name: first_name+" "+last_name,
          profile_picture:image_url,
        }
        await user.findByIdAndUpdate(id,UpdatedUserData);
    }
)
// Export functions (you can create this separately)
// Deletion function
const syncUserDeletion = inngest.createFunction(
    {id:"delete-user-with-clerk"},
    {event:'clerk/user.deleted'},
    async({event})=>{
        const {id} = event.data
        await user.findByIdAndDelete(id);
    }
)
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion
];