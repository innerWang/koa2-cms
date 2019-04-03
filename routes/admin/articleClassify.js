const router = require('koa-router')();
const DB = require('../../module/db.js');
const tools = require('../../module/tools.js');

router.get('/',async (ctx) =>{
  const result=await DB.find('article_classify',{})
  //console.log(result)
  await ctx.render('admin/articleClassify/list',{
    list: tools.classifyToList(result)
  })
})

router.get('/add',async (ctx) =>{
  //获取一级分类
  const result = await DB.find('article_classify',{"pid":'0'})
  //console.log(result)
  await ctx.render('admin/articleClassify/add',{classifylist: result})
})

router.post('/doAdd',async(ctx)=>{
  console.log(ctx.request.body)
  const addData = ctx.request.body
  const data = await DB.insert('article_classify',{...addData,"add_time":new Date()});
  if(data.result.ok){
    ctx.redirect(ctx.state.__ROOT__+'/admin/articleClassify')
  }else{
    await ctx.render('admin/error',{
      message:'新增时出错了，请重新新增...',
      redirect: ctx.state.__ROOT__ + '/admin/articleClassify/add'
    })
  }

})

router.get('/edit',async (ctx) =>{
  const id = ctx.query.id;
  const result = await DB.find('article_classify',{"_id":DB.getObjectID(id)})
  const firstLevelClassify = await DB.find('article_classify',{"pid":'0'})
  await ctx.render('admin/articleClassify/edit',{
    classify: result[0],
    classifylist: firstLevelClassify
  })
})


router.post('/doEdit',async(ctx)=>{
  const editData = ctx.request.body;
  const {id,...otherData} = editData;
  const result = await DB.update('article_classify',{"_id":DB.getObjectID(id)},otherData)
  ctx.redirect(ctx.state.__ROOT__+'/admin/articleClassify')
})

router.get('/delete',async (ctx) =>{
  ctx.body = "删除分类"
})

module.exports = router.routes();