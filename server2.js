require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const IntaSend = require('intasend-node');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json())
app.use(cors())

let intasend = new IntaSend(
    process.env.INTASEND_PUBLISHABLE_KEY,
    process.env.INTASEND_SECRET_KEY,
    true, // Test mode, set to true for test environment
);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/mpesa-payment', async (req, res) => {
    try {
        // Collect required values from the request body
        const { mpesaNumber, processingFeePay } = req.body;

        if (!mpesaNumber || !processingFeePay) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        let collection = intasend.collection();
        const response = await collection.mpesaStkPush({
            first_name: 'Collins',
            last_name: 'Aj',
            email: 'kiprocolloaj@gmail.com',
            host: 'https://example.com',
            amount: processingFeePay,
            phone_number: mpesaNumber,
            api_ref: 'test',
        });

        res.json({ message: 'Payment initiated successfully', response });
    } catch (error) {
        console.error('Error during STK Push:', error);

        if (error.response && error.response.data) {
            const errorMessage = error.response.data.toString('utf8');
            console.error('IntaSend Error Message:', errorMessage);
        }

        res.status(500).json({ message: 'Payment failed', error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
