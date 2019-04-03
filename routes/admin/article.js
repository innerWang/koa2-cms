const router = require('koa-router')();
const DB = require('../../module/db.js');
const multer = require('koa-multer');

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
  await ctx.render('admin/article/add')
})


router.post('/doAdd', upload.single('pic'),async (ctx) =>{
  ctx.body = {
    filename: ctx.req.file ? ctx.req.file.filename: '', // 返回文件名
    body: ctx.req.body
  }
})

router.get('/edit',async (ctx) =>{
  ctx.body = "修改用户信息"
})

router.get('/delete',async (ctx) =>{
  ctx.body = "删除用户"
})

module.exports = router.routes();