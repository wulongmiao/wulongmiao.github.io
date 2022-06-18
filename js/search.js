// 获取搜索框、清空搜索、结果输出对应的元素
var searchClear = document.querySelector('.search-clear');
var searchInput = document.querySelector('.search-input');
var searchResults = document.querySelector('.search-results');

//输入框内容
var searchValue = '',
    //内容
    arrContents = [],
    //链接
    arrLinks = [],
    //标题
    arrTitles = [],
    //结果
    arrResults = [],
    //匹配索引值
    indexItem = [],
    //文章匹配项
     arrItems = [],
    //文章匹配项长度
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
//兼容性(IE低版本)
var xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
// 请求初始化 /feed.xml代表在服务器的位置,true异步,get安全,大数据传输
xhr.open('get', '/feed.xml', true);
//开始发送请求到服务器
xhr.send();
//当readyState改变时,触发事件onreadystatechange
xhr.onreadystatechange = function () {
    //响应已完成,且请求成功
    if (xhr.readyState == 4 && xhr.status == 200) {
        arrItems = xhr.responseXML.getElementsByTagName('item');
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
// 实时匹配
searchInput.oninput = function () {
    searchConfirm();
}

// 搜索匹配
function searchMatching(title, content, input) {
    // 忽略输入大小写
    input = new RegExp(input, 'i');
    // 在所有文章标题、内容中匹配查询值
    for (var i = 0; i < itemLength; i++)
     {
        if (title[i].search(input) !== -1 || content[i].search(input) !== -1) {
            // 优先搜索标题
            if (title[i].search(input) !== -1) {
                var arr = title[i];
            } else {
                var arr = content[i];
            }
            indexItem.push(i);  // 保存匹配值的索引
            var indexContent = arr.search(input);
            // 此时 input 为 RegExp 格式 /input/i,转换为原 input 字符串长度
            var l = input.toString().length - 3;
            var step = 10;
            
            // 将匹配到内容的地方进行黄色标记,并包括周围一定数量的文本
            arrResults.push(arr.slice(indexContent - step, indexContent) +
                '<mark>' + arr.slice(indexContent, indexContent + l) + '</mark>' +
                arr.slice(indexContent + l, indexContent + l + step));
        }
    }

    // 输出总共匹配到的数目
    var totalDiv = tmpDiv.cloneNode(true);
    totalDiv.innerHTML = '输入匹配:<b>' + indexItem.length + '</b> 项';
    searchResults.appendChild(totalDiv);

    // 未匹配到内容的情况
    if (indexItem.length == 0) {
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerText = '输入内容无匹配项...';
        searchResults.appendChild(itemDiv);
    }

    // 将所有匹配内容进行组合
    for (var i = 0; i < arrResults.length; i++) {
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
   // location.href = href;

    // 在新标签页面打开链接
    window.open(href);
}
