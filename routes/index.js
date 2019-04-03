const router = require('koa-router')();


router.get('/',async (ctx) =>{
  //await ctx.render('index');
  ctx.body = "网站首页。。。。。"
})

module.exports = router.routes();