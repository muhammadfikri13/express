const express = require('express')
const app = express()
const port = 8383
const {db} = require('./firebase.js')
const { FieldValue } = require('firebase-admin/firestore')
const bodyParser = require('body-parser')
const multer = require('multer')
const uploadImage = require('./helpers/helpers.js')

app.use(express.json())

// Get all users with id
app.get("/", async (req, res) => {
    const snapshot = await db.collection('your-collection').get()
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}))
    res.send(list);
})

// Add a new user with a generated id.
app.post('/adduser', async (req, res) => {
    const data = req.body;
    await db.collection('your-collection').add(data);
    res.send({ msg: "User Added "})
  });

  // Update user with id
app.post('/update', async (req, res) => {
    const id = req.body.id;
    delete req.body.id;
    const data = req.body;
    await db.collection('your-collection').doc(id).update(data);
    res.send({ msg: "Updated"});
})

// Delete user with id
app.delete('/delete', async (req, res) => {
    const id = req.body.id;
    await db.collection('your-collection').doc(id).delete();
    res.send({ msg: "Deleted"});
})


//======================================================================

// upload images
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        // no longer than 5mb
        fileSize: 5 * 1024 * 1024,
    },
})

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/uploads', async (req, res, next) => {
    try {
        const myFile = req.file //mengupload gambar
        const imageUrl = await uploadImage(myFile) //memanggil fungsi upload image di helper.js

        const currentDate = new Date(); //menentukan data tanggal

        const latitude = req.body.latitude; // Mendapatkan nilai latitude dari permintaan POST
        const longitude = req.body.longitude; // Mendapatkan nilai longitude dari permintaan POST

        const data = {
            imageUrl: imageUrl,
            geolocation: {
                latitude: latitude,
                longitude: longitude
            },
            date: currentDate,
        };

        // Mengirim data ke firebase
        await db.collection('your-collection').add(data);

        res
          .status(200)
          .json({
            message: "Upload was successful",
            data: imageUrl
          })
      } catch (error) {
        next(error)
      }
    })
    
    app.use((err, req, res, next) => {
      res.status(500).json({
        error: err,
        message: 'Internal server error!',
      })
      next()
    });


//======================================================================

app.listen(port, () => console.log(`Server has started on port: ${port}`))