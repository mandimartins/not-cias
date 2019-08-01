const express = require('express')

const app = express()
const path = require('path')
const port = process.env.PORT || 3000

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

app.set('views',path.join(__dirname,'views'))

app.set('view engine','ejs')

app.use(express.static('public'))

const User = require('./models/user')
const createInitialUser = async ()=>{
    const total = await User.count({username:'Amanda Martins'})

    if(total === 0){
        const user = new User({
            username:'Amanda Martins',
            password:'abc123'
        })
        await user.save()
        console.log('user created')
    }else{
        console.log('user created skipped')
    }
}

app.get('/',(req,res)=>{
    res.render('index')
})

mongoose.connect(mongo,{useNewUrlParser:true})
.then(()=>{
    createInitialUser()
    app.listen(port, ()=>{
        console.log('listening')
    })
})
.catch((error)=>{
    console.log(error)
})