const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors'); // Import cors middleware

app.use(express.static('public'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())
//use of multer package
 const storage=multer.diskStorage({  //diskstorage is a storage engine
    destination:(req,file,cb)=>{  //destination is a function that takes 3 arguments -importantly callback(cb)path specified
        cb(null,"./public/images"); // null is for error and path is for success
    },
    filename:(req,file,cb)=>{ //filename is a function that takes 3 arguments -importantly callback(cb)
        cb(null,file.fieldname+ '_' +Date.now()+ path.extname(  file.originalname)); // null is for error and file.fieldname is for the name of the  input file we given
//file.originalname is for the original name of the file
    }

})
 const upload=multer({ //upload return middleware
    storage:storage,
    limits:{fileSize:1024*1024*5}, //5mb limit
 });// multer is a function that takes 1 argument -importantly storage

let uploadhandler = upload.single('image'); //single is a function that takes 1 argument -image is that name of we given fieldname  like fieldanme

app.post('/upload', (req, res) => {
    uploadhandler(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code == 'LIMIT_FILE_SIZE') {
                res.status(400).json({ message: 'File size too large' });
            }
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
        } else {
            res.status(200).json({ message: 'File uploaded successfully' });
        }
    });
});

const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})