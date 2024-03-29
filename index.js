const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
require('dotenv').config()

const cors = require('cors')
app.use(cors())

morgan.token( 'data' , (request)=> JSON.stringify(request.body))
app.use(morgan(' :method :url :status :res[content-length] - :response-time ms :data'))


const Contact =  require('./models/mongo')


let persons = [
]


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

/*---------------------GET requests-------------------------*/
app.get('/' , (request,response)=>{
    response.send('<h1>HELLO There</h1>')

})

app.get('/info' , (request,response)=>{
    const personsCount = persons.length
    const currentTime = new Date()
    response.send(`<p>Phonebook has info of ${personsCount} contacts </bn> </br> ${currentTime}</p>`)
})

app.get('/api/persons' , (request,response)=>{
    Contact.find({})
        .then( persons => {
            return response.json(persons)

        })
        .catch( (error)=>{
        console.log(error.message)
    } )
})

app.get('/api/persons/:id' , (request,response , next)=>{
    Contact.findById(request.params.id).then(contact => {
        if (contact) {
            response.json(contact)
        }else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})


/*---------------------DELETE requests-------------------------*/

app.delete('/api/persons/:id' , (request,response , next)=>{
    Contact.findByIdAndDelete(request.params.id).then(result => {
            response.status(204).end()
    }) .catch(error => next(error))
})

/*---------------------POST requests-------------------------*/

app.post( "/api/persons" , (request , response )=>{
    const person = request.body

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'some data is missing'
        })
    } else if(persons.find( (p) =>person.name === p.name)) {
        return response.status(400).json({
            error: 'person already exists'
        })
    }

    const contact = new Contact({
        name : person.name,
        number : person.number,
    })

    contact.save().then(savedContact => {
        response.json(savedContact)
    })
})

/*---------------------PUT requests-------------------------*/

app.put( '/api/persons/:id' , (request , response , next)=>{
    const person = request.body

    const contact = {
        name : person.name,
        number : person.number
    }

    Contact.findByIdAndUpdate(request.params.id , contact , { new: true })
        .then( result => {
        console.log( " result " , result)
        response.json(result)
    }).catch(error => next(error))
})



app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
