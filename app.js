import React from 'react'
import ReactDOM from 'react-dom'
//import './app.css'


const _Facty = () => <p></p>

const factyDOM = {
	0 : {
		tag: "BODY",
		id: undefined,
		class: undefined,
		children: {
			0 : {
				tag: "DIV",
				id: undefined,
				class: undefined,
				children: {
					0 : {
						tag: "DIV",
						id: undefined,
						class: undefined,
						children: {
							0 : {
								tag: "DIV",
								id: undefined,
								class: undefined,
								children: {
									0 : {
										tag: "H1",
										id: undefined,
										class: undefined,
										children: {},
										facty: {
											start: 0,
											end: 7,
											element: "Welcome to Factify"
										}
									}
								}
							}
						}
					},
					1 : {
						tag: "DIV",
						id: undefined,
						class: undefined,
						children: {},
						facty: {
							start: undefined,
							end: undefined,
							element: <p id="facty">We have DOMS</p>
						}
					}
				}
			}
		}
	}
}

window.addEventListener('load', function() {
	console.log(`Getting DOM from factys.facity.com for ${window.location.href}`)
	synthDOM(document.activeElement, factyDOM[0])
})

const clickFacty = (_ele) => {
	const ele = _ele
	return e => {
		console.log(`You clicked ${ele}!`)
	}
}

const synthDOM = (base, synth) => {
	//console.log(`${base.parentElement.tagName} -> ${base.tagName}`)
	if(base !== undefined && synth !== undefined && "tag" in synth && base.tagName === synth.tag){
		if("facty" in synth){
			console.log("render")
			let facty = synthElement(synth.facty, base)
			//ReactDOM.render(facty, base)
		}else{
			let base_children = base.children
			for(let i in base_children){
				console.log("deeper")
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
	let baseHTML = base.innerHTML
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
