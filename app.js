import React from 'react'
import ReactDOM from 'react-dom'

const _Facty = () => <p></p>

const factyDOM = {
	0 : {
		tag: "BODY",
		id: undefined,
		class: undefined,
		children: {
			0 : {
				tag: "SECTION",
				id: undefined,
				class: undefined,
				children: {
					0 : {
						tag: "DIV",
						id: undefined,
						class: undefined,
						children: {
							"facty": <facty>Welcome to Factify</facty>
						}
					},
					1 : {
						tag: "DIV",
						id: undefined,
						class: undefined,
						children: {
							"facty": <facty>We have DOMS</facty>
						}
					}
				}
			}
		}
	}
}

class TestDOM extends React.Component {
	render() {
		return (
			<html>
				<body>
					<facty>test</facty>
				</body>
			</html>
		)
	}
}

window.addEventListener('load', function() {
	console.log(`Getting DOM from factys.facity.com for ${window.location.href}`)
	synthDOM(document.activeElement, factyDOM[0])
})

const synthDOM = (base, synth) => {
	//console.log(`${base.parentElement.tagName} -> ${base.tagName}`)
	if(base !== undefined && synth !== undefined && "tag" in synth && base.tagName === synth.tag){
		if("facty" in synth.children){
			console.log("render")
			ReactDOM.render(synth.children.facty, base)
		}else{
			let base_children = base.children
			for(let i in base_children){
				console.log("deeper")
				synthDOM(base.children[i], synth.children[i])
			}
		}
	}
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
