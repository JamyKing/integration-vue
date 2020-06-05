// getUUID
export function getUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
	  return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
	})
}

// 导航栏数字角标
export function setTitleNViewStyle(index, show, text) {  
    let pages = getCurrentPages();  
    let page = pages[pages.length - 1];
    // #ifdef APP-PLUS  
    let currentWebview = page.$getAppWebview();  
    if (show) {
        if (text) {
			currentWebview.setTitleNViewButtonBadge({index:index,text:text})
        } else {
			currentWebview.showTitleNViewButtonRedDot({index:index})
        }
    } else {
		currentWebview.removeTitleNViewButtonBadge({index:index})
		currentWebview.hideTitleNViewButtonRedDot({index:index})
    }  
    // #endif
}