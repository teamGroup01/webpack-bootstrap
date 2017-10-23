import Layer from './js/index.js';
function App() {
	var dom = document.getElementById('app');
	var layer = new Layer();
	dom.innerHTML = layer.tpl

}
new App();