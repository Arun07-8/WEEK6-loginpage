const adminModel=require("../model/adminModel")
const userModel=require("../model/userModel")
const bcrypt=require('bcrypt')
const saltround = 10;


const loadLogin=async(req,res)=>{
     res.render('admin/adminLogin')
}
const  login=async(req,res)=>{
     try{
           const {username,password}=req.body

           const admin=await adminModel.findOne({username})
           
           if(!admin) return  res.render("admin/adminLogin",{message:"Invalid credentials"})
      
           const  isMatch=await bcrypt.compare(password,admin.password)
        
             
           if(!isMatch) return  res.render('admin/adminLogin',{message:"Invalid credentials"})
           
              req.session.admin=true
              req.session.Mes="Login successfull"
              res.redirect("/admin/dashBoard")

     }catch(error){
          res.send('error')
     }
}

const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin;
        if (!admin) return res.redirect("/admin/adminLogin");

        // Await the result of the find method
        let users = await userModel.find({});
        if(req.session.search){
          users=req.session.search
          req.session.search=null
        }

        let msg;
        if(req.session.msg){
          msg = req.session.msg
          req.session.msg = null
        }
        

        res.render("admin/dashBoard", { users, msg });
    } catch (error) {
       
    }
};
const editUser=async(req,res)=>{
     try {
          const {username,email,password}=req.body
          
           const hashed =await bcrypt.hash(password, saltround)
           const user=await userModel.findOneAndUpdate({email},{$set:{username,password:hashed}}) 
            
           req.session.msg="User edited successfully"
           res.redirect('/admin/dashBoard')
          
     } catch (error) {
          console.log(error);
          
     }
}
const addUser=async(req,res)=>{
     try {
          
          const {username,email,password}=req.body

          const hashedpassword=await bcrypt.hash(password ,saltround)

          const newUser=new userModel({
               username,
               email,
               password:hashedpassword
          })
          await newUser.save()

          req.session.msg="User added successfully"
          res.redirect("/admin/dashBoard")
     } catch (error) {
          console.log(error);
          
     }
}
const deleteUser=async(req,res)=>{
 const {email}=req.body
 let  user=await  userModel.findOneAndDelete({email})
 req.session.msg="User deleted successfully"
 res.redirect("/admin/dashboard")

}
const searchUser=async(req,res)=>{
     try {
          const  {username} = req.body
          
          if(username.length<=0){
              res.redirect("/admin/dashBoard");
              return 
          }
  
          const  user = await userModel.find({
               username: { $regex: `^${username}`, $options: "i" }
          });
  
          req.session.search = user
          res.redirect('/admin/dashboard')
  
  
      } catch (error) {
          console.log(error);
          
      }
  }
  

const logout=(req,res)=>{
     req.session.admin=null
     res.redirect('/admin/adminLogin')
   } 
   

module.exports={loadLogin,login,loadDashboard,logout,editUser, deleteUser,addUser,searchUser}