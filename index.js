const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
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
    response.send('<h1>HELLO Trhe</h1>')

})

app.get('/info' , (request,response)=>{
    const personsCount = persons.length
    const currentTime = new Date()
    response.send(`<p>Phonebook has info of ${personsCount} contacts </bn> </br> ${currentTime}</p>`)
})

app.get('/api/persons' , (request,response)=>{
    Contact.find({})
        .then( persons => {
            console.log( "contact : ---> ", persons, typeof persons)
            return response.json(persons)

        })
        .catch( (error)=>{
        console.log(error.message)
    } )
})

app.get('/api/persons/:id' , (request,response)=>{
    Contact.findById(request.params.id).then(contact => {
        response.json(contact)
    })
})


/*---------------------DELETE requests-------------------------*/

app.delete('/api/persons/:id' , (request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find( p => p.id === id )
    persons = persons.filter( p => p.id !== id )
    if (person) {
        response.send(`person with id ${id} deleted`)
    }else {
        response.status(404).end()
    }
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

app.use(unknownEndpoint)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
