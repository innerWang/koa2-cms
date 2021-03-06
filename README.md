# koa2 的使用



### 1. `koa-router`
安装`koa-router`
```js
yarn add koa-router
```
使用：
```js
const router = require('koa-router')(); //引入并实例化

//配置路由
router.get('/',async (ctx)=>{
	ctx.body = '首页'
})

app.use(router.routes())    //启动路由
   .use(router.allowedMethods())  //建议配置，用于根据ctx.status 设置response响应头
```

### 2. koa中间件

* 应用级中间件
* 路由中间件
* 错误处理中间件
* 第三方中间件

中间件的执行流程遵循洋葱图。 使用`next()`会在当前路由匹配完成之后继续往下匹配。


### 3. koa使用ejs模板引擎
安装 `koa-views`和`ejs`
```js
  yarn add koa-views
  yarn add ejs
```

使用：
```js
const views = require('koa-views');

app.use(views('views',{extension:'ejs'})); //模板位于当前目录的views文件夹下

router.get('/',async(ctx)=>{
  await ctx.render('index');  //渲染index.ejs模板
})

```

### 4. 使用`koa-bodyparser`处理表单数据
安装`koa-bodyparser`
```js
yarn add koa-bodyparser
```

使用：
```js
const bodyParser = require('koa-bodyparser');

/*配置post bodyparser中间件*/
app.use(bodyParser());

//接收post提交的数据
router.post('/doAdd',async(ctx)=>{
  // ctx.request.body 即为表单提交的数据
  ctx.body = ctx.request.body;	
})

```

### 5. 使用`koa-static`静态资源中间件
安装`koa-static`
```js
yarn add koa-static
```
使用：
```js
const static = require('koa-static');
app.use(static(__dirname + '/static'));  //配置./static目录为静态资源目录

```

### 6. 使用高性能模板引擎`art-template`
安装`art-template`和`koa-art-template`
```
yarn add art-template
yarn add koa-art-template
```

**koa 提供了ctx.state来保存状态数据，可在全局使用**


使用：
```js
const render = require('koa-art-template')

//配置
render(app, {
  root: path.join(__dirname, 'views'),  // 视图的位置，位于程序运行目录的views文件夹中
  extname: '.html',                        //后缀名
  debug: process.env.NODE_ENV !== 'production'   //是否开启调试模式
});

// 渲染
router.get('/',async(ctx)=>{
  await ctx.render('index');  //渲染index.html模板
})

```

### 7. silly-datetime 以及 art-template定义日期管道
需要使用silly-datetime提供的format方法来配置art-template引擎的管道
```js
// 配置模板引擎
render(app, {
  root: path.join(__dirname, 'views'),  // 视图的位置
  extname: '.html',                        //后缀名
  debug: process.env.NODE_ENV !== 'production',   //是否开启调试模式
  dateFormat: dateFormat = function(value){
    return sd.format(value,'YYYY-MM-DD HH:mm');
  }
});
```
在模板中采用` {{$value.dateObj}} | dateFormat`即可渲染格式化之后的时间


### 8. 使用koa-jsonp 模块获取json数据


### 9. 使用分页器实现分页功能


### 10. 使用koa-multer实现文件上传，如图片上传等
注意 ： form 表单需要添加 `enctype="multipart/form-data"` 的属性设置。

enctype: 当 method 属性值为 post 时, enctype 是将form的内容提交给服务器的媒体类型
* `application/x-www-form-urlencoded`: 未指定属性时的默认值。
* `multipart/form-data` : 这个值用于一个 type 属性设置为 "file" 的 <input> 元素
* `text/plain` (HTML5)


```js
<form action="/doAdd" method="POST" enctype="multipart/form-data">

<div class="form-group">
  <label  for="pic">封面图:</label>
  <input type="file" id="pic" name="pic" />
</div>
         <!-- button to submit -->
</form>


const multer = require('koa-multer');
const storage = multer.diskStorage({
  //配置上传文件保存的目录 图片上传的目录必须存在！！
  destination: function (req, file, cb) {
    cb(null, 'public/upload/images')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    //获取后缀名，分割数组
    const postfix = (file.originalname).split(".").slice(-1)[0]
    cb(null, Date.now()+"."+postfix)
  }
})
const upload = multer({ storage: storage })

// 注意 ： 此处的pic一定要与上述上传图片的input框中的name一致！！！！！
router.post('/doAdd', upload.single('pic'),async (ctx) =>{
  ctx.body={
    filename: ctx.req.file ? ctx.req.file.filename: '',
    body: ctx.req.body
  }
})

```

### 11. koa2-ueditor 富文本编辑器


### 12. 网站SEO(搜索引擎优化)技巧

1. 设置网站的标题、关键字、描述
2. 图片添加alt
3. 合理使用html标签
4. 合理使用h标签，一个页面建议只出现一次
5. 合理使用内链和外链
6. 内容为王(原创)
7. 长尾关键词

### 13. koa提供api接口

浏览器向一个域发起请求时总是会带上这个域及其父域的cookie

同源策略只阻止读取ajax返回的内容，实际上请求仍发送到了服务器

#### 13.1 jsonp的方式
后台需要配置可以使用jsonp(koa-jsonp). 需要注意jsonp仅支持get请求。

##### 1. 原生js发起请求
使用script标签，给src属性赋值为要请求的接口，页面加载时会向script标签中的src发起请求，返回的内容即为`xxxx({...})`的形式，页面在接收到返回后直接执行`xxxx()`。

```js
  function xxxx(data){
    console.log(data)
  }

  <script src="http://localhost:3000/api/catelist?callback=xxxx"></script>
```

##### 2. jquery发起请求
```js
 $(function(){
   var url = 'http://localhost:3000/api/catelist';
   $.ajax({
     url:url,
     dataType:'jsonp',
     data:'',
     jsonp:'callback',  /**/
     success:function(data){   /*请求成功后调用的函数*/
       console.log(data)
     },
     timeout:3000
   })
 })
```

#### 13.2 cors的方式

安装koa2-cors，配置后台允许通过cors的方式进行跨域。
```js
var Koa = require('koa');
var cors = require('koa2-cors');
var app = new Koa();
app.use(cors());

```

### 14. koa2 RESTful API设计

1. 协议，尽量使用HTTPS
2. 域名，尽量部署在专属域名下面，
3. 将api的版本号放入url中
4. 在RESTful架构中，每个网址代表一种资源，所以网址中不能有动词，只能有名次，且所用的名次往往与数据库的表格名对应。
5. http请求数据的方式：
  * GET(SELECT) : 从服务器取资源
  * POST(CREATE) : 在服务器新建一个资源
  * PUT(UPDATE) : 在服务器更新资源，客户端需提供改变后的完整资源
  * DELETE(DELETE) : 从服务器删除资源
  * PATCH(UPDATE) : 在服务器更新资源(客户端提供要改变的属性)
  * HEAD
  * OPTIONS
6. 过滤方式、请求数据方式、返回数据的格式(json)、安全性(签名验证鉴权)


### 



