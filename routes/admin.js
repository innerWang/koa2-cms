const router = require('koa-router')();

const url = require('url');

const ueditor = require('koa2-ueditor');


//配置中间件 获取url的地址将其配置为模板引擎的全局变量
router.use(async (ctx,next)=>{
  //模板引擎配置全局的变量
  ctx.state.__ROOT__ = "http://"+ctx.request.header.host;
  
  const pathname = url.parse(ctx.url).pathname
 // console.log(ctx.url,path)
  //左侧菜单选中功能
  const pathArr = pathname.slice(1).split('/')
  ctx.state.G = {
    url: pathArr,
    userinfo: ctx.session.userInfo,
    prevPage: ctx.request.headers['referer'] /** 记录上一页的地址*/
  }
  
  //权限判断
  if(ctx.session.userInfo){
    //注意一定要next，否则不会往下匹配
    await next();
  }else{
    //跳转到登录页面
    if(pathname === '/admin/login' || pathname === '/admin/login/doLogin' || pathname === '/admin/login/code'){
      await next();
    }else{ 
      ctx.redirect('/admin/login');
    }
    
  }

  
})


const loginRouter = require('./admin/login.js');
const userRouter = require('./admin/user.js');
const administratorRouter = require('./admin/administrator.js');
const indexRouter = require('./admin/index.js');
const articleClassifyRouter = require('./admin/articleClassify.js');
const articleRouter = require('./admin/article.js');
const carouselRouter = require('./admin/carousel.js');
const linkRouter = require('./admin/link.js');
const navRouter = require('./admin/nav.js');
const settingRouter = require('./admin/setting.js');

router.use('/login',loginRouter);
router.use('/user',userRouter);
router.use('/administrator',administratorRouter);
router.use('/articleClassify',articleClassifyRouter);
router.use('/article',articleRouter);
router.use('/carousel',carouselRouter);
router.use('/link',linkRouter);
router.use('/nav',navRouter);
router.use('/setting',settingRouter);
router.use(indexRouter);


// 注意此处上传图片的路由，在拷贝下来保存的/public/ueditor/ueditor.config.js中修改post的路由
router.all('/editorUpload', ueditor(['public', {
	"imageAllowFiles": [".png", ".jpg", ".jpeg"],
	"imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))


module.exports = router.routes();