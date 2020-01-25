import React from 'react'
import ReactDOM from 'react-dom'
import fetch from 'node-fetch'
import CircularJSON from 'circular-json'

import util from 'util'

//var factyDOM = {}
const facty_site = "http://108.18.248.41:3003"
var isRegistered = false;
var editMode = false;
/*window.addEventListener('click', function(e) {
	console.log(`test: ${e.target}`)
})*/

window.addEventListener('load', function() {
	console.log('loaded')
	//console.log(`Getting DOM from factys.facity.com for ${window.location.href}`)
	fetch(`${facty_site}/content`, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json'}),
		body: JSON.stringify({"address":window.location.href.slice(0, -1)})
	})
	.then(res => res.json())
	.then(res => {console.log(`data: ${util.inspect(res)}`);return res})
	.then(res => CircularJSON.parse(res["content"]))
	.then(res => synthDOM(document.activeElement.parentElement, res))
	.then(res => registerHighlighter())
	.catch(e => console.log(e))


	document.onclick = e => {
		if(isRegistered && editMode){
			console.log(`${e.target}`)
			const _div = document.createElement('div')
			_div.style.position = 'absolute'
			_div.style.width = '100vw'
			_div.style.height = '10vh'
			const _text = document.createElement('input')
			const _butn = document.createElement('button')

			_div.appendChild(_text)
			_div.appendChild(_butn)

			document.activeElement.appendChild(_div)
			//ReactDOM.render(Commentor(), document.activeElement)
		}
	}
})

const constructFacty = _target => {
	const target = _target;
	return () => {
		console.log(`publishing facty on ${target}`)
	}
}

const Commentor = target => {
	return (
		<div style={{width:"100vw", height: "100vh"}}>
			<input></input>
			<button onClick={constructFacty(target)}>Publish</button>
		</div>				
	)
}

const clickFacty = (_ele) => {
	const ele = _ele
	return e => {
		console.log(`You clicked ${ele}!`)
	}
}

const synthDOM = (base, synth) => {
	//console.log(base)
	//console.log(synth)
	//console.log(`${base.parentElement.tagName} -> ${base.tagName}`)
	if(base !== undefined && synth !== undefined && synth.type === "tag" && base.tagName.toLowerCase() === synth.name.toLowerCase()){
		//console.log("match")
		if("facty" in synth){
			console.log("render")
			let facty = synthElement(synth.facty, base)
			//ReactDOM.render(facty, base)
		}else{
			let c = base.children
			//console.log(`${base.tagName} ~ ${c}`)
			for(let i in c){
				//console.log("deeper")
				synthDOM(base.children[i], synth.children[i])
			}
		}
	}
}

//Prepare the facty for the base
const synthElement = (facty, base) => {
	if(base.tagName === "DIV"){
		let rend = <div style={{display: "flex", background: "#3fff6faf"}} onClick={clickFacty(facty.element)}>{base}</div>
		ReactDOM.render(rend, base)
		return null
	}
	//For text cases
	let baseHTML = base.innerText
	let left = baseHTML.slice(0, facty.start)
	let middle = baseHTML.slice(facty.start, facty.end)
	let right = baseHTML.slice(facty.end,)
	baseHTML = left + "" + right
	console.log([left, facty, right])
	let rend = (<div style={{display:"flex"}}>
			{left}
			<div style={{display: "flex", background: "#3fff6faf"}} onClick={clickFacty(facty.element)}>{middle}</div>
			{right}
		</div>)
	ReactDOM.render(rend, base)
}

const registerHighlighter = () => {
	isRegistered = true;
}

const _synthDOM = (base, synth) => {
	console.log("Synthesizing DOM")
	console.log(`using ${base.tagName}`)
	console.log(`adding ${synth}`)
	let DOMkeys = Object.keys(synth)
	console.log(`${DOMkeys}`)
	DOMkeys.forEach(key => {
		let tag = synth[key].tag
		console.log(tag)
		if(tag === base.tagName && "facty" in synth[key].children){
			ReactDOM.render(synth[key].children["facty"], base)
		}else{
			let _base = base.children
			let _synth = synth[key].children
			for(let i in _base)
				synthDOM(_base[i], _synth[i])
		}
	})
	//ReactDOM.render(synth[base.tagName], document.getElementById("page"))
}

//Tag names in JS: element.tagName
//Get an element by Tag: element.getElementsByTagName("str")
