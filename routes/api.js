const router = require('koa-router')();
const DB = require('../module/db.js');

router.get('/',async (ctx) =>{
  ctx.body = "api接口"
})

router.get('/catelist',async(ctx)=>{
  const catelist = await DB.find('article_classify',{})
  ctx.body = {
    result: catelist
  }
})


//增加购物车数据
router.post('/addCart',async(ctx)=>{
  //接收客户端提交的数据、主要做的操作是增加数据
  //ctx.request.body获取post提交的数据，需要安装使用koa-bodyparser


  ctx.body = {
    "success":true,
    'message':'增加数据成功'
  }
})

//修改用餐人数的接口
router.put('/editPeopleInfo',async(ctx)=>{
  //接收客户端提交的数据、主要做的操作是修改数据
  //ctx.request.body获取post提交的数据，需要安装使用koa-bodyparser

  ctx.body = {
    "success":true,
    'message':'修改数据成功'
  }
})

//删除购物车数据
router.delete('/deleteCart',async(ctx)=>{
  //接收客户端提交的数据、主要做的操作是删除数据
  //ctx.query来接收数据

  ctx.body = {
    "success":true,
    'message':'删除数据成功'
  }
})

module.exports = router.routes();