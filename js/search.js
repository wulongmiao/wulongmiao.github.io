// 获取搜索框、搜索按钮、清空搜索、结果输出对应的元素
var searchBtn = document.querySelector('.search-start');
var searchClear = document.querySelector('.search-clear');
var searchInput = document.querySelector('.search-input');
var searchResults = document.querySelector('.search-results');

//输入框内容
var searchValue = '',
   //文章匹配项
    arrItems = [],
    //内容
    arrContents = [],
    //链接
    arrLinks = [],
    //标题
    arrTitles = [],
    //结果
    arrResults = [],
    //匹配项
    indexItem = [],
    //匹配项长度
    itemLength = 0;
var tmpDiv = document.createElement('div');
tmpDiv.className = 'result-item';

// 每次搜索完成后的初始化
function searchInit() {
    arrResults = [];
    indexItem = [];
    searchResults.innerHTML = '';
    searchResults.style.display = 'block';
    searchClear.style.display = 'block';
}

// 点击清空按钮
searchClear.onclick = function(){
    searchInput.value = '';
    searchResults.style.display = 'none';
    searchClear.style.display = 'none';
}

//输入框状态检测
function searchConfirm() {
    //无输入时
    if (searchInput.value == '') {
        searchResults.style.display = 'none';
        searchClear.style.display = 'none';
    } 
      // 输入值全是空格的情况
    else if (searchInput.value.search(/^\s+$/) >= 0) {
         searchInit();
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerText = '请输入有效内容...';
        searchResults.appendChild(itemDiv);
    }
    // 合法输入值的情况
     else {
        searchInit();
        searchValue = searchInput.value;
        // 在标题、内容中查找
        searchMatching(arrTitles, arrContents, searchValue);
    }
}

// 开始获取根目录下 feed.xml 文件内的数据
xhr.open('get', '/feed.xml', true);
xhr.send();
searchBtn.onclick = searchConfirm;

// 实时匹配，可以处理中文输入法拼写的变化
// 经测试，onkeydown, onchange 等方法效果不太理想，
// 存在输入延迟等问题，最后发现触发 input 事件最理想，
searchInput.oninput = function () {
    setTimeout(searchConfirm, 0);
}


// 搜索匹配
function searchMatching(arr1, arr2, input) {
    // 忽略输入大小写
    input = new RegExp(input, 'i');
    // 在所有文章标题、内容中匹配查询值
    for (i = 0; i < itemLength; i++) {
        if (arr1[i].search(input) !== -1 || arr2[i].search(input) !== -1) {
            // 优先搜索标题
            if (arr1[i].search(input) !== -1) {
                var arr = arr1;
            } else {
                var arr = arr2;
            }
            indexItem.push(i);  // 保存匹配值的索引
            var indexContent = arr[i].search(input);
            // 此时 input 为 RegExp 格式 /input/i，转换为原 input 字符串长度
            var l = input.toString().length - 3;
            var step = 10;
            
            // 将匹配到内容的地方进行黄色标记，并包括周围一定数量的文本
            arrResults.push(arr[i].slice(indexContent - step, indexContent) +
                '<mark>' + arr[i].slice(indexContent, indexContent + l) + '</mark>' +
                arr[i].slice(indexContent + l, indexContent + l + step));
        }
    }
// ajax 的兼容写法
var xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        xml = xhr.responseXML;
        arrItems = xml.getElementsByTagName('item');
        itemLength = arrItems.length;
        
        // 遍历并保存所有文章对应的标题、链接、内容到对应的数组中
        // 同时过滤掉 HTML 标签
        for (i = 0; i < itemLength; i++) {
            arrContents[i] = arrItems[i].getElementsByTagName('description')[0].
                childNodes[0].nodeValue.replace(/<.*?>/g, '');
            arrLinks[i] = arrItems[i].getElementsByTagName('link')[0].
                childNodes[0].nodeValue.replace(/<.*?>/g, '');
            arrTitles[i] = arrItems[i].getElementsByTagName('title')[0].
                childNodes[0].nodeValue.replace(/<.*?>/g, '');
        }
    }
}
    // 输出总共匹配到的数目
    var totalDiv = tmpDiv.cloneNode(true);
    totalDiv.innerHTML = '输入匹配：<b>' + indexItem.length + '</b> 项';
    searchResults.appendChild(totalDiv);

    // 未匹配到内容的情况
    if (indexItem.length == 0) {
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerText = '输入内容无匹配项...';
        searchResults.appendChild(itemDiv);
    }

    // 将所有匹配内容进行组合
    for (i = 0; i < arrResults.length; i++) {
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerHTML = '<b>《' + arrTitles[indexItem[i]] +
            '》</b><hr />' + arrResults[i];
        itemDiv.setAttribute('onclick', 'changeHref(arrLinks[indexItem[' + i + ']])');
        searchResults.appendChild(itemDiv);
    }
}

//匹配内容打开方式
function changeHref(href) {

    // 在当前页面打开链接
    location.href = href;

    // 在新标签页面打开链接
    // window.open(href);
}
