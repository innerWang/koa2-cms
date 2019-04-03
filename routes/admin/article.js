const router = require('koa-router')();
const DB = require('../../module/db.js');
const multer = require('koa-multer');
const tools = require('../../module/tools.js');

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


router.get('/',async (ctx) =>{
  var pageNum = ctx.query.page || 1;
  var pageSize = 3;
  var count = await DB.count('article',{});
 // console.log(count)
  const result = await DB.find('article',{},{},{pageNum,pageSize})
  await ctx.render('admin/article/list',{
    list : result,
    pageNum:pageNum,
    totalPages: Math.ceil(count/pageSize)
  })
})

router.get('/add',async (ctx) =>{
  //查询分类数据
  const classifyList = await DB.find('article_classify',{});
  await ctx.render('admin/article/add',{
    catelist: tools.classifyToList(classifyList)
  })
})

// 一定要注意，此处的'pic'要与模板add.html的图片输入框的name一致！！！！！
router.post('/doAdd', upload.single('pic'),async (ctx) =>{
  const data = ctx.req.body

  let pid = data.pid;
  let classifyname = data.catename.trim();
  let title = data.title.trim();
  let author = data.author.trim();
  let status = data.status;
  let keywords = data.keywords.trim();
  let is_best = data.is_best;
  let is_hot = data.is_hot;
  let is_new = data.is_new;
  let description = data.description || '';
  let content = data.content || '';
  let img_url = ctx.req.file ? ctx.req.file.path: '';
  img_url = img_url.split('\\').slice(1).join('/'); // 进行格式转换
  let lastModify_time = new Date();
 // let sort = Math.random()
  let json = {
    pid,classifyname,title,author,status,
    keywords,is_best,is_hot,is_new,description,
    content,img_url,lastModify_time
  }
 // console.log(json)

  await DB.insert('article',json);

  ctx.redirect(ctx.state.__ROOT__+"/admin/article")

})

router.get('/edit',async (ctx) =>{
  const id = ctx.query.id;
  const result = await DB.find('article',{'_id':DB.getObjectID(id)});
  const catelist = await DB.find('article_classify',{});
 // console.log(tools.classifyToList(catelist))
  await ctx.render('admin/article/edit',{
    catelist: tools.classifyToList(catelist),
    article: result[0]
  })
})

router.get('/delete',async (ctx) =>{
  ctx.body = "删除用户"
})

module.exports = router.routes();