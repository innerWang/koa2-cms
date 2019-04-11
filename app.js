const Koa = require('koa'),
      router = require('koa-router')(),
      render = require('koa-art-template'),
      path = require('path'),
      static = require('koa-static'),
      session = require('koa-session'),
      bodyParser = require('koa-bodyparser'),
      sd = require('silly-datetime'),
      jsonp = require('koa-jsonp'),
      cors = require('koa2-cors');

//引入子路由
const adminRouter = require('./routes/admin.js');
const apiRouter = require('./routes/api.js')
const indexRouter = require('./routes/index.js')

//实例化
const app = new Koa();

// 配置jsonp中间件
app.use(jsonp())

// 配置后台允许跨域，安全性的保证需要使用签名验证
app.use(cors());

//配置post提交数据的bodyparser中间件
app.use(bodyParser());

//配置session中间件
app.keys = ['some secret hurr'];  /*cookie的签名 不用管*/
const CONFIG = {
  key: 'koa:sess',   
  maxAge: 3600000,  /*cookie的过期时间， 【需要设置】*/
  autoCommit: true, 
  overwrite: true, 
  httpOnly: true, 
  signed: true, 
  rolling: true, /** 每次请求都强制设置cookie, 会重置cookie过期时间 【可以考虑设置】*/
  renew: false, /** 当session快过期的时候更新cookie  【需要设置】*/
};
app.use(session(CONFIG, app));


//配置模板引擎
render(app, {
  root: path.join(__dirname, 'views'),  // 视图的位置
  extname: '.html',                        //后缀名
  debug: process.env.NODE_ENV !== 'production',   //是否开启调试模式
  dateFormat: dateFormat = function(value){
    return sd.format(value,'YYYY-MM-DD HH:mm');
  }
});
// 配置静态资源的中间件,可同时配置多个
//app.use(static('.'));  // 去根目录下(即包含app.js的目录)寻找,但是这样不安全
app.use(static(__dirname+'/public'));  //去根目录下面的public目录下寻找

//配置路由 层级路由
router.use('/admin',adminRouter);
router.use('/api',apiRouter);
router.use(indexRouter);   //其余默认都使用indexRouter进行匹配

//启动路由
app.use(router.routes())
   .use(router.allowedMethods());


app.listen(3000);