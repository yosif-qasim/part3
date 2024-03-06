
const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]



const url =
    `mongodb+srv://yossif:${password}@fso.tshfdlf.mongodb.net/PhoneBook?retryWrites=true&w=majority&appName=FSO`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Contact = mongoose.model('Contact', phonebookSchema)

if ( password && !( name || number)){

    Contact.find({}).then(result => {
        console.log('contacts in DB : ')
        result.forEach(contact => {
            console.log(contact.name , contact.number)
        })
        mongoose.connection.close()
    })

} else {

    const contact = new Contact({
        name: name,
        number: number,
    })

    contact.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })


}