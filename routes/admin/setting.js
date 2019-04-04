const router = require('koa-router')();
const DB = require('../../module/db.js');
const tools = require('../../module/tools.js');

router.get('/', async (ctx) => {
  const result = await DB.find('setting',{})
  await ctx.render('admin/setting/index',{
    result: result[0] || {}
  })
})

router.post('/doEdit',tools.multer().single('site_logo'),async(ctx)=>{
  const data = ctx.req.body;
  const img_url = ctx.req.file ? ctx.req.file.path : '';
  const site_logo = img_url.split('\\').slice(1).join('/'); // 进行格式转换
  const json = {site_logo,...data}

  await DB.update('setting',{},json);
  ctx.redirect(ctx.state.__ROOT__+'/admin/setting');

})

module.exports = router.routes();