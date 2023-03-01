const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./database');

// init app & middleware
const app = express();

app.use(express.json());

// db connection
let db;
connectToDb((err) => {
	if (!err) {
		app.listen(3000, () => {
			console.log('listening');
		});
		db = getDb();
	}
});



// routes
app.get('/books', (req, res, next) => {
	let books = [];
	// find method returns not data, but cursor
	// toArray, forEach - this is all Cursor methods
	// and this al  are async functions
	db.collection('books1')
		.find()
		.sort({ author: 1 })
		.forEach(book => {
			books.push(book);
		})
		.then(() => {
			res.status(200).json(books);
		})
		.catch(err => {
			res.status(500).json({ error: "couldn't fetch docs" });
		});

	// res.json({ mssg: "wellcome to the api" });
});

app.get('/books/:id', (req, res, next) => {
	if (ObjectId.isValid(req.params.id)) {
		db.collection('books1')
			.findOne({ _id: new ObjectId(req.params.id) })
			.then((result) => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(500).json({ error: "couldn't fetch docs " + err });
			});
	} else {
		console.log("wrong _id")
	}
});

// insert book
app.post('/books', (req, res) => {
	const book = req.body;
	db.collection('books1')
		.insertOne(book)
		.then(result => {
			res.status(201).json(result);
		})
		.catch(err => {
			res.status(500).json({ error: 'insert failed: ' + err });
			console.log('insert failed', err);
		})
})

// delete book
app.delete('/books/:id', (req, res) => {
	const bookId = req.params.id;
	if (ObjectId.isValid(bookId)) {
		db.collection('books1')
			.deleteOne({ _id: new ObjectId(bookId) })
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(500).json({ error: 'delete failed: ' + err });
				console.log('delete failed', err);
			})
	} else {
		res.status(500).json({ error: 'delete failed: ' });
		console.log('delete failed');
	}
});

// update 
app.patch('/books/:id', (req, res) => {
	const updates = req.body;
	const bookId = req.params.id;
	if (ObjectId.isValid(bookId)) {
		db.collection('books1')
			.updateOne(
				{ _id: new ObjectId(bookId) },
				{ $set: updates }
			)
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(500).json({ error: 'update failed: ' + err });
				console.log('update failed', err);
			})
	} else {
		res.status(500).json({ error: 'update failed' });
		console.log('update failed');
	}
});