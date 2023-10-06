// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const User = require('./models/User');
// const Post = require('./models/Post');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// const multer = require('multer');
// const { GridFsStorage } = require('multer-gridfs-storage');
// const crypto = require('crypto');
// const path = require('path');
// const mongooseURI = 'mongodb+srv://blog:9asOCCRuT5mdj76t@cluster0.h5f9ofn.mongodb.net/?retryWrites=true&w=majority';

// const salt = bcrypt.genSaltSync(10);
// const secret = 'YOUR_SECRET_KEY';

// const app = express();
// const uploadMiddleware = multer({ storage: getStorageEngine() }); 

// let gfs;

// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(express.json());
// app.use(cookieParser());
// app.use('/uploads', express.static(__dirname + '/uploads'));

// mongoose.connect(mongooseURI, { useNewUrlParser: true, useUnifiedTopology: true });

// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log('MongoDB database connection established successfully');
//   gfs = new mongoose.mongo.GridFSBucket(connection.db, {
//     bucketName: 'uploads', 
//   });
// });

// function getStorageEngine() {
//   return new GridFsStorage({
//     url: mongooseURI,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads', 
//           };
//           resolve(fileInfo);
//         });
//       });
//     },
//   });
// }

// const File = mongoose.model('File', {
//   filename: String,
//   contentType: String,
// });


// // 9asOCCRuT5mdj76t
// app.post('/register', async (req,res) => {
//   const {username,password} = req.body;
//   try{
//     const userDoc = await User.create({
//       username,
//       password:bcrypt.hashSync(password,salt),
//     });
//     res.json(userDoc);
//   } catch(e) {
//     console.log(e);
//     res.status(400).json(e);
//   }
// });

// app.post('/login', async (req,res) => {
//   const {username,password} = req.body;
//   const userDoc = await User.findOne({username});
//   const passOk = bcrypt.compareSync(password, userDoc.password);
//   if (passOk) {
//     // logged in
//     jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
//       if (err) throw err;
//       res.cookie('token', token).json({
//         id:userDoc._id,
//         username,
//       });
//     });
//   } else {
//     res.status(400).json('wrong credentials');
//   }
// });

// app.get('/profile', (req,res) => {
//   const {token} = req.cookies;
//   jwt.verify(token, secret, {}, (err,info) => {
//     if (err) throw err;
//     res.json(info);
//   });
// });

// app.post('/logout', (req,res) => {
//   res.cookie('token', '').json('ok');
// });


// app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
//   const newFile = new File({
//     filename: req.file.filename,
//     contentType: req.file.contentType,
//   });

//   newFile.save((err, savedFile) => {
//     if (err) {
//       console.error('Error saving file to MongoDB:', err);
//       return res.status(500).json({ error: 'Failed to save file' });
//     }

//     console.log('File saved to MongoDB:', savedFile);
//     const {token} = req.cookies;

//     // Rest of the code remains the same...

//     jwt.verify(token, secret, {}, async (err, info) => {
//       if (err) throw err;
//       const { title, summary, content } = req.body;
//       const postDoc = await Post.create({
//         title,
//         summary,
//         content,
//         cover: savedFile.filename, // Use the saved filename from MongoDB
//         author: info.id,
//       });
//       res.json(postDoc);
//     });
//   });
// });

// app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
//   let newPath = null;

//   if (req.file) {
//     const { originalname, path } = req.file;
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     newPath = path + '.' + ext;
//     fs.renameSync(path, newPath);
//   }

//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;

//     try {
//       const { id, title, summary, content } = req.body;
//       const postDoc = await Post.findById(id);

//       if (!postDoc) {
//         return res.status(404).json({ error: 'Post not found' });
//       }

//       const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

//       if (!isAuthor) {
//         return res.status(403).json({ error: 'You are not the author of this post' });
//       }

//       if (newPath) {
//         // If the post already has a cover, delete the associated image from MongoDB using GridFS
//         if (postDoc.cover) {
//           gfs.remove({ filename: postDoc.cover }, (err, gridStore) => {
//             if (err) {
//               console.error('Error deleting file from MongoDB:', err);
//               return res.status(500).json({ error: 'Failed to delete file' });
//             }

//             console.log('File deleted from MongoDB:', postDoc.cover);
//           });
//         }

//         // Save the updated uploaded file to MongoDB using GridFS
//         const newFile = new File({
//           originalName: req.file.originalname,
//           filename: req.file.filename,
//         });

//         newFile.save((err, savedFile) => {
//           if (err) {
//             console.error('Error saving file to MongoDB:', err);
//             return res.status(500).json({ error: 'Failed to save file' });
//           }

//           console.log('File saved to MongoDB:', savedFile);
//         });

//         postDoc.cover = req.file.filename;
//       }

//       postDoc.title = title;
//       postDoc.summary = summary;
//       postDoc.content = content;

//       await postDoc.save();

//       res.json(postDoc);
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while updating the post and associated image' });
//     }
//   });
// });

// app.get('/post', async (req,res) => {
  
//   res.json(
//     await Post.find()
//       .populate('author', ['username'])
//       .sort({createdAt: -1})
//       .limit(20)
//   );
// });

// app.get('/post/:id', async (req, res) => {
//   const { id } = req.params;
//   const postDoc = await Post.findById(id).populate('author', ['username']);
//   console.log(postDoc.cover)
//   if (postDoc.cover) {
//     const file = await File.findOne({ filename: postDoc.cover });
//     if (file) {
//       const readStream = gfs.openDownloadStreamByName(file.filename);
//       readStream.pipe(res);
//     res.json(postDoc);

//     }
//   } else {
//     res.json(postDoc);
//   }
// });



// app.delete('/post/:id', async (req, res) => {
//   const { id } = req.params;

//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;

//     try {
//       // Check if the post exists and is authored by the user
//       const postDoc = await Post.findById(id);
//       if (!postDoc) {
//         return res.status(404).json({ error: 'Post not found' });
//       }

//       const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
//       if (!isAuthor) {
//         return res.status(403).json({ error: 'You are not the author of this post' });
//       }

//       // If the post has a cover, delete the associated image from MongoDB
//       if (postDoc.cover) {
//         const file = await File.findOne({ filename: postDoc.cover });
//         if (file) {
//           // Delete the file from MongoDB
//           await File.deleteOne({ _id: file._id });
//           // Delete the file from GridFS
//           await connection.gfs.remove({ filename: file.filename });
//         }
//       }

//       // Delete the post from the database
//       await Post.findByIdAndDelete(id);

//       res.json({ message: 'Post and associated image deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'An error occurred while deleting the post and associated image' });
//     }
//   });
// });


// app.listen(4000);
// //


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const fs = require('fs');
const apikey = require('./apikey.json');
const Scope = ['https://www.googleapis.com/auth/drive.file'];

const salt = bcrypt.genSaltSync(10);
const secret = 'my_secret_key';


const mongooseURI = 'mongodb+srv://blog:9asOCCRuT5mdj76t@cluster0.h5f9ofn.mongodb.net/?retryWrites=true&w=majority';
const app = express();
const uploadMiddleware = multer({ dest: 'uploads/' });

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

async function auth() {
  const jwtClient = new google.auth.JWT(
    apikey.client_email,
    null,
    apikey.private_key,
    Scope
  );
    await jwtClient.authorize();
return jwtClient;
};


mongoose.connect(mongooseURI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// ... (User and File models)

// ... (Registration, login, profile, and logout routes remain the same)
const File = mongoose.model('File', {
  filename: String,
  contentType: String,
});



// 9asOCCRuT5mdj76t
app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', 'Token').json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;

  jwt.verify(Token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const newFile = {
    name: req.file.originalname,
    mimeType: req.file.mimetype,
    fileStream: fs.createReadStream(req.file.path),
  };

  try {
    // Upload the file to Google Drive
const authc = await auth();

    const drive = google.drive({ version: 'v3', auth: authc});

    const response = await drive.files.create({
      resource: {
        name: newFile.name,
        parent:["1UB4prqCUSynsak7_M-0tu-0ibNyVixsh"]
      },
      media: {
        mimeType: newFile.mimeType,
        body: newFile.fileStream,
      },
    });

    const file = response.data;
    fs.unlinkSync(req.file.path); // Delete the local file

    // Create a new Post document in MongoDB
    jwt.verify(Token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        
        summary,
        content,
        cover: file.id, // Use the file ID from Google Drive as the cover
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    res.status(500).json({ error: 'Failed to upload file to Google Drive' });
  }
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(Token, secret, {}, async (err, info) => {
    if (err) throw err;

    try {
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

      if (!isAuthor) {
        return res.status(403).json({ error: 'You are not the author of this post' });
      }

      if (newPath) {

const authc = await auth();

        // If the post already has a cover, delete the associated image from Google Drive
        if (postDoc.cover) {
          const drive = google.drive({ version: 'v3', auth: authc });

          await drive.files.delete({ fileId: postDoc.cover });

          console.log('File deleted from Google Drive:', postDoc.cover);
        }

        // Upload the updated image to Google Drive
        const drive = google.drive({ version: 'v3', auth: authc });

        const response = await drive.files.create({
          resource: {
            name: req.file.originalname,
            parent:["1UB4prqCUSynsak7_M-0tu-0ibNyVixsh"]
          },
          media: {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(newPath),
          },
        });

        const file = response.data;

        // Save the file ID from Google Drive to MongoDB
        postDoc.cover = file.id;
      }

      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;

      await postDoc.save();

      res.json(postDoc);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the post and associated image' });
    }
  });
});

app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  console.log(postDoc.cover);
  if (postDoc.cover) {
const authc = await auth();

    const drive = google.drive({ version: 'v3', auth: authc });

    const fileResponse = await drive.files.get({ fileId: postDoc.cover, alt: 'media' });

    res.set('Content-Type', fileResponse.headers['content-type']);
    fileResponse.data.pipe(res);
  } else {
    res.json(postDoc);
  }
});

app.delete('/post/:id', async (req, res) => {
  const { id } = req.params;

  const { token } = req.cookies;
  jwt.verify(Token, secret, {}, async (err, info) => {
    if (err) throw err;

    try {
      // Check if the post exists and is authored by the user
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json({ error: 'You are not the author of this post' });
      }

      // If the post has a cover, delete the associated image from Google Drive
      if (postDoc.cover) {
const authc = await auth();

        const drive = google.drive({ version: 'v3', auth:authc });

        await drive.files.delete({ fileId: postDoc.cover });

        console.log('File deleted from Google Drive:', postDoc.cover);
      }

      // Delete the post from the database
      await Post.findByIdAndDelete(id);

      res.json({ message: 'Post and associated image deleted successfully' });
    } catch (error) {
            res.status(500).json({ error: 'An error occurred while deleting the post and associated image' });
          }
        });
      });
      
      
      app.listen(4000);