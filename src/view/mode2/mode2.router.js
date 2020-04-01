const r = require.context('./view', false, /vue/)
var arr = []
r.keys().forEach(key => {
    const _keyarr = key.split('.')
    if (key.includes('index')) {
        arr.push({
            path: _keyarr[1],
            component: r(key).default
        })
    } else {
        arr.push({
            path: `${_keyarr[1]}/${_keyarr[2]}`,
            component: r(key).default
        })
    }
});
export default arr