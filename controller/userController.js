const userSchema = require("../model/userModel");
      // If you're hashing the password
      const bcrypt=require('bcrypt')
const saltround=10; 


const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    // Check if user already exists by username or email
    const existingUser = await userSchema.findOne( { email } );
    if (existingUser) {

      req.session.userMsg = 'User already exist'
      res.redirect('/user/register')
      return;

    }else{
      const hashed=await bcrypt.hash(password, saltround)

      const newUser = new userSchema({
          username,
          email,
          password:hashed,

      })
      await newUser.save()

      req.session.loginErr = 'User created successfully'
      res.redirect('/user/login')
      return;
    }
      
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).render('user/register', { message: "An error occurred, please try again." });
  }
};


const login= async (req,res)=>{
  try {
      let {username,password}=req.body
      const user = await userSchema.findOne({username});

      if(!user){
          req.session.loginErr = 'User does not exist'
          res.redirect('/user/login')
          return;
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if(!isMatch){
        req.session.loginErr = 'Incorrect password';
          res.redirect('/user/login')
          return;
      }
      req.session.user=user.username;

      res.redirect('/user/home');

  } catch (error) {
    
      req.session.loginErr = 'Something went wrong'
      res.redirect('/user/login')
  }
}

const loadRegister=(req,res)=>{
  if(req.session.userMsg){
    let message=req.session.userMsg
    req.session.userMsg=null
    res.render("user/register",{message})
    return;
  }
  res.render("user/register")
}
const loadLogin=(req,res)=>{
  if(req.session.loginErr){
    let message = req.session.loginErr
    req.session.loginErr = null;
    res.render('user/login',{message})
    return;
  }
  res.render('user/login')

}

const loadHome=(req,res)=>{

  res.render("user/home",{user:req.session.user

})
}

const logout=(req,res)=>{
  req.session.user=null
  res.redirect('/user/login')
}
module.exports = { 
  registerUser,
  loadRegister,
  loadLogin,
  login,
  loadHome,
  logout
};
