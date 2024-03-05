import axios from "axios";

const baseurl = "http://localhost:3001/persons"

const getContacts = () => {
    return axios
        .get(baseurl)
        .then( contacts =>{
            return (contacts.data)
        })
}

const addContact = (newContact) => {
    return axios
        .post(baseurl,newContact)
        .then( response => response.data)
}

const deleteContact = (id) => {
    const url = baseurl + "/"+id;
    console.log(url)
    return axios.delete(url)
}

const updateContact = (id , newContact) =>{
    const url = baseurl + "/"+id;
    return axios.put(url , newContact )
}
export default {getContacts , addContact , deleteContact , updateContact}