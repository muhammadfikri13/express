const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const serviceAccount = require('./firebaseCreds.json') //firebase creds

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore() // inisiasi db firestore

module.exports = { db }