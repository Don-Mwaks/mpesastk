const express = require('express');
const app = express();
const unirest = require('unirest');
const port = 3000;

const consumer_key = "vhsCJoICe3M2dRs09y7dTqNCc8qXlDDqHyoXkafNAgGXSHZD";
const consumer_secret = "oYa1l0fQZXeHHFdglPYJevB2PiwGyohA1u4lq6ps6sLVAoXMDDg9BAI8jJ6E3dJv";

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next()
});

app.get('/', (req, res) => {
    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

    unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
        .headers({ 'Authorization': `Basic ${auth}` })
        .end(response => {
            if (response.error) {
                res.status(500).send('Error getting access token');
                console.error(response.error);
            } else {
                const accessToken = JSON.parse(response.raw_body).access_token;

                // Get the current date and format it
                const currentDate = new Date();
                const formatedDate = currentDate.toISOString().replace(/[-T:]/g, '').slice(0, 14);
                console.log(formatedDate);
                const authorization = accessToken;

                const postData = {
                    "BusinessShortCode": 174379,
    "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwNDE4MTcyNjIz",
    "Timestamp": "20240418172623",
    "TransactionType": "CustomerPayBillOnline",
    "Amount": 1,
    "PartyA": 254705357558,
    "PartyB": 174379,
    "PhoneNumber": 254705357558,
    "CallBackURL": "https://mydomain.com/path",
    "AccountReference": "CompanyXLTD",
    "TransactionDesc": "Payment of X" 
                };

                // Stringify the postData before sending
                const postDataString = JSON.stringify(postData);

                unirest.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
                    .headers({ 'Content-Type':'application/json',
                                'Authorization': 'Bearer L6Zd4fM9YKzBwjwXjBNPLhiHtjGj',
                              })
                    .send(postDataString)
                    .end(response => {
                        if (response.error) {
                            res.status(500).send('Error sending push request');
                            console.error(response.error);
                        } else {
                            const responseBody = JSON.parse(response.raw_body).ResponseDescription;
                            res.send('Message: ' + responseBody);
                            console.log('Message:', responseBody);
                        }
                    });
            }
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

