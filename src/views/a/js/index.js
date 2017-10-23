import tpl from '../index.html';
require('../../../js/js/button')
require('../../../js/js/dropdown')
require('../../../js/js/scrollspy')
import '../less/common.less';
function Layer() {
	return {
		name: 'layer',
		tpl
	}
}
export default Layer;