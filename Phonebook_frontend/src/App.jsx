import { useState } from 'react'
import {useEffect} from "react";
import Filter from "./components/Filter.jsx";
import Persons from "./components/Persons.jsx";
import PersonForm from "./components/PersonForm.jsx";
import server_connection from "./services/server_connection.js";



const App = () => {

    const setContats = () => {
        console.log("from setContats ")
        server_connection
            .getContacts()
            .then(contacts => setPersons(contacts) )
    }

     useEffect( setContats, [])

    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber , setNewNumber] = useState('')
    const [newFilter , setnewFilter] = useState('')

    const addName = event => setNewName(event.target.value)
    const addNumber = event => setNewNumber(event.target.value)
    const doSearch = event => setnewFilter(event.target.value)




    const addPerson = (event) => {
        event.preventDefault()
        const newObject = {
            name : newName ,
            number : newNumber,
            id : (persons.length +1).toString()
        }
        server_connection
            .addContact(newObject)
            .then( contact => setPersons(persons.concat(contact)) )
        setNewName('')
    }

    const checkInput = (event) => {
        event.preventDefault()
        const personCheck = persons.find((p) => p.name === newName )
        personCheck
            ? replaceContact(personCheck.id)
            : addPerson(event)
    }

    const replaceContact = (id) => {
        const newObject = {
            name : newName ,
            number : newNumber,
            id : (persons.length +1).toString()
        }
        if(window.confirm(`contact with the same name already exists , do you want to replace it ???`)){
            server_connection.updateContact(id , newObject).then(()=>setContats() )
        }
    }

    const deleteContact = (id)=>{
        if(window.confirm(`delete user with id ${id} ???`)){
        server_connection.deleteContact(id).then( ()=>setContats())
        }
    }

    return (
    <>
        <h2>Phonebook</h2>
        <Filter value={newFilter} onChange={doSearch}/>
        <PersonForm newName={newName} addName={addName} newNumber={newNumber} addNumber={addNumber} checkInput={checkInput} />
        <h2>Numbers</h2>
        <Persons persons={persons} newFilter={newFilter} deleteContact={deleteContact} />
    </>
    )
}

export default App