//Web Handling
const fetch = require('node-fetch')
const express = require('express')
const cors = require('cors')

//DOM Manipulation
const parse = require('html-dom-parser')
const CircularJSON = require('circular-json')

//Debugging & Utility
const util = require('util')
const fs = require('fs')

const fetch_DOM = address =>  fetch(address)
	//Unwrap response
	.then(res => res.text())
	//JSONify DOM
	.then(res => parse(res))
	//Remove Header, contains unwanted bulk (scripts)
	.then(res => behead(res))
	//Store DOM for usage
	.then(res => DOM_CACHE[address] = res)
	//.then(res => console.log(util.inspect(res, false, 3, true)))
	.catch(e => console.log(e))

const write_cache_to_disk = () => {
	let cache_string = CircularJSON.stringify(DOM_CACHE)
	fs.writeFileSync(FILE, cache_string)
}

const read_cache_from_disk = file => {
	let cache_string = fs.readFileSync(file)
	return CircularJSON.parse(cache_string)
}

//Remove the data from <head></head> from a DOM object
const behead = DOM => {
	if(typeof DOM !== 'object' || DOM === [])
		return DOM
	let document_children = DOM[0].children
	let head_idx
	document_children.forEach((child, idx) => {
		if(child.name === 'head')
			head_idx = idx
	})
	if(head_idx !== undefined)
		document_children.splice(head_idx, 1)
	DOM[0].children = document_children
	return DOM
}

const FILE = 'doms.json'
const DOM_CACHE = read_cache_from_disk(FILE) //{}

const PORT = 4386
const server = express()
	.use(cors())
	.use(express.json())

server.post('/content', (req, res) => {
	let address = req.body['address']
	console.log(req.body)
	console.log(address)
	let content
	if(address in DOM_CACHE)
		console.log(`cache hit`)
		content = CircularJSON.stringify(DOM_CACHE[address])
	res.send({content : content})
})

server.listen(PORT, () => console.log(`Factify is live on port ${PORT}`))
