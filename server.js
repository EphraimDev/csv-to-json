const express = require('express');
const bodyParser = require('body-parser');
const csv = require('csvtojson');
const request = require('request');

const app = express();

app.use(bodyParser.json());

app.get('/', (_req, res) => {
	res.send('Backend Developer Challenge');
});
app.post('/', async (req, res) => {
	try {
		const { url, select_fields } = req.body;
		const json = await csv({
			noheader: false,
		}).fromStream(request.get(url));

		const conversion_key = randomString();

		if (select_fields) {
			const selected_fields = [];

			json.forEach((element) => {
				const selected_obj = {};

				for (let i = 0; i < select_fields.length; i++) {
					const each_field = select_fields[i];

					selected_obj[each_field] = element[each_field];
				}

				if (Object.keys(selected_obj).length !== 0)
					selected_fields.push(selected_obj);
			});
			return res.json({
                conversion_key,
                json: selected_fields,
                status: 'success'
			});
		}
		return res.json({
            conversion_key,
			json,
            status: 'success'
		});
	} catch (error) {
		return res.status(400).json({
            error: error.message,
            status: 'error'
		});
	}
});

function randomString() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 32; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

app.listen(3000, () => {
	console.log('Listening on port: 3000');
});
