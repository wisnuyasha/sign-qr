const express = require('express');
const app = express();
const port = 5000; // Specify the desired port
let crypto = require('crypto');
const { db } = require ('./config');

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
  

  app.post('/sign', (req, res) => {
    let data = req.body.data;
    let privateKey = req.body.privateKey;
  
    privateKey = crypto.createPrivateKey({
      key: Buffer.from(privateKey, 'base64'),
      type: 'pkcs8',
      format: 'der',
    });
  
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey).toString('base64');
  
    // Store data and signature in Firestore
    db.collection('documents')
      .add({ data, signature })
      .then((docRef) => {
        res.send({ id: docRef.id, data, signature });
      })
      .catch((error) => {
        res.status(500).send({ error: 'Failed to store document' });
      });
  });

  app.post('/verify', (req, res) => {
    let { data, publicKey, signature } = req.body;
  
    publicKey = crypto.createPublicKey({
      key: Buffer.from(publicKey, 'base64'),
      type: 'spki',
      format: 'der',
    });
  
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
  
    // Retrieve data and signature from Firestore
    db.collection('documents')
      .where('data', '==', data)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          res.send({ verify: false, error: 'Document not found' });
        } else {
          querySnapshot.forEach((doc) => {
            const storedSignature = doc.data().signature;
  
            // Verify the signature against the stored signature
            let result = verify.verify(publicKey, Buffer.from(signature, 'base64'));
  
            res.send({ data, signature, verify: result });
          });
        }
      })
      .catch((error) => {
        res.send({ verify: false, error: 'Failed to verify document' });
      });
  });
 


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});