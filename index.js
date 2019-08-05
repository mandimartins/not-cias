const express = require('express')

const app = express()
const path = require('path')
const port = process.env.PORT || 3000

const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

const User = require('./models/user')
const Noticia = require('./models/noticia')
const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const auth = require('./routes/auth')
const pages = require('./routes/pages')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(session({ secret: 'fullstack-master' }))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

app.use((req, res, next)=>{
    if('user' in req.session){
        res.locals.user = req.session.user
    }
    next()
})

app.use('/restrito', (req, res, next)=>{
    if( 'user' in req.session){
        next()
    }else{
        res.redirect('/login')
    }
})
app.use('/noticias',noticias)
app.use('/restrito',restrito)

app.use('/', auth)
app.use('/',pages)

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
    const noticia = new Noticia ({
        title: 'Notícia Publica ' + new Date().getTime(),
        content:'Content',
        category:'public'
    })
    await noticia.save()

    const noticia2 = new Noticia ({
        title: 'Notícia Privada ' + new Date().getTime(),
        content:'Content',
        category:'private'
    })
    await noticia2.save()
}

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