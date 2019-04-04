const router = require('koa-router')();
const DB = require('../../module/db.js');

router.get('/', async (ctx) => {
  const result = await DB.find('nav',{},{},{
    sortBy: {
      lastModified_time: -1
    }
  })
  await ctx.render('admin/nav/list', {
    list: result
  })
})

router.get('/add', async (ctx) => {
  await ctx.render('admin/nav/add')
})

router.post('/doAdd',  async (ctx) => {
  const data = ctx.request.body;
  const json = {...data,lastModified_time:new Date()}
  await DB.insert('nav',json)
  ctx.redirect(ctx.state.__ROOT__ + '/admin/nav')
})

router.get('/edit', async (ctx) => {
  const id = ctx.query.id;
  const result = await DB.find('nav', {
    '_id': DB.getObjectID(id)
  })
  await ctx.render('admin/nav/edit', {
    result: result[0]
  })
})

router.post('/doEdit', async (ctx) => {
  const data = ctx.request.body;

  var id = data.id;
  var title = data.title;
  var url = data.url;
  var status = data.status;
  var sort =  data.sort || '';
  var lastModified_time = new Date();
 
  let  json = {title,url,status,sort,lastModified_time}
  
  await DB.update('nav',{"_id":DB.getObjectID(id)},json)

  ctx.redirect(ctx.state.__ROOT__ + '/admin/nav')

})

module.exports = router.routes();