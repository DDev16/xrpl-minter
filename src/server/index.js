const express = require('express');
const cors = require('cors');
const { RippleAPI } = require('ripple-lib');

const app = express();
const api = new RippleAPI({ server: 'wss://s.altnet.rippletest.net:51233' }); // Testnet server
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/mint', upload.single('image'), async (req, res) => {
  try {
    const nftData = {
      name: req.body.name,
      description: req.body.description,
      image: req.file.buffer.toString('base64') // Assuming you want to store the image as a base64 string
    };

    await api.connect();

    const preparedTx = await api.prepareTransaction({
      "TransactionType": "AccountSet",
      "Account": xrplAddress,
      "NFTData": Buffer.from(JSON.stringify(nftData)).toString("hex"),
      "Fee": "12000",
    });
    

    const signedTx = api.sign(preparedTx.txJSON, xrplSecret);
    const txResult = await api.submit(signedTx.signedTransaction);

    await api.disconnect();

    if (txResult.resultCode === 'tesSUCCESS') {
      res.json({ success: true });
    } else {
      console.error('Transaction failed:', txResult.resultMessage);
      res.status(400).json({ error: txResult.resultMessage });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
