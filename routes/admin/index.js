const router = require('koa-router')();
const DB = require('../../module/db.js');

router.get('/',async (ctx) =>{
  await ctx.render('admin/index')
})

router.get('/changeStatus',async (ctx) =>{
  //console.log(ctx.query)
  var collection=ctx.query.collectionName; /*数据库*/
  var attr=ctx.query.attr; /*属性*/
  var id=ctx.query.id; /*更新的 id*/
  var data= await DB.find(collection,{"_id":DB.getObjectID(id)});
  if(data.length>0){
    if(data[0][attr] == 1){
      var json = { /*es6 属性名表达式*/
        [attr]: '0'
      };
    }else{
      var json = {
        [attr]: '1'
      };
    } 
    let updateResult=await DB.update(collection,{"_id":DB.getObjectID(id)},json);
    //console.log(updateResult);
    if(updateResult){
      ctx.body={"message":'更新成功',"success":true};
    }else{
      ctx.body={"message":"更新失败","success":false}
    }
  }else{
    ctx.body={"message":'更新失败,参数错误',"success":false};
  }
})

router.get('/delete',async (ctx) =>{
  try{
    var collection=ctx.query.collection; /*数据库表*/
    var id=ctx.query.id; /*更新的 id*/
    await DB.remove(collection,{"_id":DB.getObjectID(id)});
  }catch(e){
    console.log(err)
  } 
  ctx.redirect(ctx.state.G.prevPage)

})



module.exports = router.routes();