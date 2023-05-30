const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/getCheapestProducts', async (req, res) => {
    const brand = req.query.brand;
    const url = `https://www.hepsiburada.com/${brand}?siralama=artanfiyat`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive'
    };
    try {
        const { data } = await axios.get(url, { headers });
        
        const $ = cheerio.load(data);
        const productDivs = $('li.search-item');
        const items = [];
        productDivs.each((i, el) => {
            const linkElement = $(el).find('a[href]');
            const link = linkElement.length ? 'https://www.hepsiburada.com' + linkElement.attr('href') : 'N/A';
            const nameElement = $(el).find('h3.product-title');
            const name = nameElement.length ? nameElement.text().trim() : 'N/A';
            const priceDiv = $(el).find('div.price-content.have-one-price');
            let price = 'N/A';
            if (priceDiv.length) {
                const priceElement = priceDiv.find('span');
                price = priceElement.length ? priceElement.contents().filter(function() {
                    return this.nodeType === 3;
                }).text().trim().split(' ')[0] : 'N/A';
            }
            items.push({ name, price, link });
        });
        const cheapestItems = items.sort((a, b) => {
            const priceA = a.price === 'N/A' ? Number.MAX_VALUE : parseFloat(a.price.replace(',', '').replace('.', ''));
            const priceB = b.price === 'N/A' ? Number.MAX_VALUE : parseFloat(b.price.replace(',', '').replace('.', ''));
            return priceA - priceB;
        }).slice(0, 20);
        res.json(cheapestItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
