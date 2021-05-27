const passport =require("passport");
const LocalStrategy =require("passport-local").Strategy;

const JwtStrategy=require("passport-jwt").Strategy;
const User=require('./models/User.js');


const cookieExtractor=req=>{
    let token=null;

    if(req && req.cookies){
        token=req.cookies["access_token"];
    }
    
    return token;
}

//userfor Authorisation to protect endpoints
passport.use(new JwtStrategy({
    jwtFromRequest:cookieExtractor,
    secretOrKey:"noobCoder"
},(payload,done)=>{
    User.findById({_id: payload.sub},(err,user)=>{
        if(err)
        return done(err,false);

        if(user)return done(null,user);

        else return done(null,false);
    })
}))


//for authentication using username and password local startegy
passport.use(new LocalStrategy((username,password,done)=>{
    User.findOne({username},(err,user)=>{
        if(err)
           return done(err);

        if(!user)
           return done(null,false);
//check if pw correct
        user.comparePassword(password,done);
    })
}))