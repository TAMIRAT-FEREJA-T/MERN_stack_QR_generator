const request = require('supertest');
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Mocking the QR code generation endpoint
app.post('/generate-qr', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required to generate a QR code' });
    }

    const qrData = {
        config: {
            body: 'square',
            eye: 'frame0',
            eyeBall: 'ball0',
            bodyColor: '#000000',
            bgColor: '#ffffff',
            eye1Color: '#000000',
            eye2Color: '#000000',
            eye3Color: '#000000',
            logo: '',
            text: text
        },
        file: 'png'
    };

    try {
        const response = await axios.post('https://api.qrcode-monkey.com/qr/custom', qrData, {
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
        });

        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

// Jest tests
describe('QR Code Generation', () => {
    it('should generate a QR code successfully', async () => {
        // Mocking the axios post method
        jest.spyOn(axios, 'post').mockResolvedValue({
            data: Buffer.from('mocked-qr-code-image'), // Mocked binary data
            headers: { 'content-type': 'image/png' }
        });

        const response = await request(app)
            .post('/generate-qr')
            .send({ text: 'Test QR Code' });

        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(Buffer.from('mocked-qr-code-image'));
        
        // Restore axios.post after the test
        axios.post.mockRestore();
    });

    it('should return 400 if no text is provided', async () => {
        const response = await request(app)
            .post('/generate-qr')
            .send({}); // Sending empty body

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Text is required to generate a QR code' });
    });

    it('should handle errors during QR code generation', async () => {
        // Mocking the axios post method to throw an error
        jest.spyOn(axios, 'post').mockRejectedValue(new Error('Network Error'));

        const response = await request(app)
            .post('/generate-qr')
            .send({ text: 'Test QR Code' });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to generate QR code' });

        // Restore axios.post after the test
        axios.post.mockRestore();
    });
});
