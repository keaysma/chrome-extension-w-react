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
	//Remove text nodes, only keep HTML tags
	.then(res => top_DOM_clean(res))
	//Remove Header, contains unwanted bulk (scripts)
	.then(res => behead(res[0]))
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
	console.log(`behead ${util.inspect(DOM)}`)
	if(typeof DOM !== 'object' || DOM === []){
		return DOM
	}
	DOM.children.forEach(child => {
		if(child.name === 'head'){
			child.children = []
		}
	})
	return DOM
}

//Remove all non-tags from DOM
const top_DOM_clean = DOMS => {
	var cleaned_DOMS = []
	DOMS.forEach(dom => {
		let cleaned_dom = DOM_clean(dom)
		if(cleaned_dom !== undefined)
			cleaned_DOMS = cleaned_DOMS.concat([cleaned_dom])
	})
	return cleaned_DOMS
}

const DOM_clean = DOM => {
	//console.log("clean")
	if(typeof DOM !== 'object' 
		|| DOM === [] 
		|| !DOM.hasOwnProperty("type") 
		|| DOM.type !== "tag"
		|| !DOM.hasOwnProperty("children")){
		return undefined
	}
	let clean_children = []
	DOM.children.forEach(child => {
		if(child.type === 'tag'){
			clean_children = clean_children.concat([DOM_clean(child)])
		}
	})
	DOM.children = clean_children
	delete DOM.next
	delete DOM.prev
	delete DOM.parent
	delete DOM.attribs
	return DOM
}

const FILE = 'doms.json'
var DOM_CACHE = read_cache_from_disk(FILE) //{}

const PORT = 3003 //4386
const server = express()
	.use(cors())
	.use(express.json())

server.post('/content', (req, res) => {
	let address = req.body['address']
	console.log(req.body)
	console.log(address)

	let content
	if(!DOM_CACHE.hasOwnProperty(address)){
		console.log(`cache miss`)
		fetch_DOM(address)
	}
	content = CircularJSON.stringify(DOM_CACHE[address])

	res.send({content : content})
})

server.listen(PORT, () => console.log(`Factify is live on port ${PORT}`))
