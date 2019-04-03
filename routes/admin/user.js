const router = require('koa-router')();


router.get('/',async (ctx) =>{
  await ctx.render('admin/user/list')
})

router.get('/add',async (ctx) =>{
  await ctx.render('admin/user/add')
})

router.get('/edit',async (ctx) =>{
  ctx.body = "修改用户信息"
})

router.get('/delete',async (ctx) =>{
  ctx.body = "删除用户"
})

module.exports = router.routes();