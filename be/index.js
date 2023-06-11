const express = require('express');
const app = express();
const port = 5000; // Specify the desired port
let crypto = require('crypto');
const multer = require("multer");
const { db, storage } = require ('./config');

const upload = multer({ storage: multer.memoryStorage() });
// Define your routes and middleware here

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json()); 
 // Add this line to parse JSON data

app.get('/KeyGen', (req, res) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'der',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'der',
      },
    });
  
    // Store the key pair in Firestore
    db.collection('keyPairs')
      .add({ publicKey: publicKey.toString('base64'), privateKey: privateKey.toString('base64') })
      .then((docRef) => {
        res.send({ id: docRef.id, publicKey: publicKey.toString('base64'), privateKey: privateKey.toString('base64') });
      })

      .catch((error) => {
        res.status(500).send({ error: 'Failed to store key pair' });
      });
  });
  
  let uploadedFile; // Variable to store the uploaded file information

  app.post("/upload", upload.single("file"), (req, res) => {
    // Store the uploaded file information
    uploadedFile = req.file;
  
    const storageRef = storage.ref(`files/${uploadedFile.originalname}`);
  
    storageRef
      .put(uploadedFile.buffer)
      .then((snapshot) => {
        console.log("File uploaded successfully");
        res.json({ message: "File uploaded successfully" });
      })
      .catch((error) => {
        console.error("Failed to upload file:", error);
        res.status(500).json({ error: "Failed to upload file" });
      });
  });
  
  app.post("/sign", (req, res) => {
    let privateKey = req.body.privateKey;
  
    privateKey = crypto.createPrivateKey({
      key: Buffer.from(privateKey, "base64"),
      type: "pkcs8",
      format: "der",
    });
  
    if (!uploadedFile) {
      res.status(400).send({ error: "No file uploaded" });
      return;
    }
  
    const sign = crypto.createSign("SHA256");
    sign.update(uploadedFile.buffer);
    sign.end();
    const signature = sign.sign(privateKey).toString("base64");
  
    const fileName = uploadedFile.originalname;
    const fileBuffer = uploadedFile.buffer;
    const fileBase64 = fileBuffer.toString("base64");
  
    // Store the file metadata (filename, signature, and file content as Base64 string) in Firestore
    db.collection("documents")
      .add({
        fileName,
        signature,
        fileContent: fileBase64,
      })
      .then((docRef) => {
        res.send({ id: docRef.id, fileName, signature });
      })
      .catch((error) => {
        console.error("Failed to sign document:", error);
        res.status(500).send({ error: "Failed to sign document" });
      });
  });
  
  app.post("/verify", (req, res) => {
    let { fileName, publicKey, signature } = req.body;
  
    publicKey = crypto.createPublicKey({
      key: Buffer.from(publicKey, "base64"),
      type: "spki",
      format: "der",
    });
  
    // Retrieve the document with the matching filename from Firestore
    db.collection("documents")
      .where("fileName", "==", fileName)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          res.send({ verify: false, error: "Document not found" });
        } else {
          querySnapshot.forEach((doc) => {
            const storedSignature = doc.data().signature;
            const fileContentBase64 = doc.data().fileContent;
            const fileBuffer = Buffer.from(fileContentBase64, "base64");
  
            const verify = crypto.createVerify("SHA256");
            verify.update(fileBuffer);
            verify.end();
  
            try {
              // Verify the signature against the stored signature
              const result = verify.verify(publicKey, Buffer.from(signature, "base64"));
  
              if (result) {
                // Verification successful, generate the file download URL
                const storageRef = storage.ref(`files/${fileName}`);
                storageRef
                  .getDownloadURL()
                  .then((url) => {
                    res.send({ fileName, signature, verify: true, fileURL: url });
                  })
                  .catch((error) => {
                    console.error("Failed to get file download URL:", error);
                    res.status(500).send({ error: "Failed to get file download URL" });
                  });
              } else {
                // Verification failed
                res.send({ fileName, signature, verify: false });
              }
            } catch (error) {
              console.error("Error during verification:", error);
              res.status(500).send({ error: "Error during verification" });
            }
          });
        }
      })
      .catch((error) => {
        console.error("Failed to verify document:", error);
        res.status(500).send({ error: "Failed to verify document" });
      });
  });

  app.get('/documents/:id', (req, res) => {
    const documentId = req.params.id;
  
    // Retrieve the document from Firestore based on the ID
    db.collection('documents')
      .doc(documentId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          res.status(404).send({ error: 'Document not found' });
        } else {
          // Extract all attributes from the document data
          const attributes = doc.data();
          res.send(attributes);
        }
      })
      .catch((error) => {
        res.status(500).send({ error: 'Failed to fetch document' });
      });
  });  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});