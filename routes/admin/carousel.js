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



router.get('/', async (ctx) => {
  var pageNum = ctx.query.page || 1;
  var pageSize = 3;
  var count = await DB.count('carousel',{});
  const result = await DB.find('carousel',{},{},{
    pageNum,
    pageSize
  })
  await ctx.render('admin/carousel/list', {
    list: result,
    pageNum:pageNum,
    totalPages: Math.ceil(count/pageSize)
  })
})

router.get('/add', async (ctx) => {
  await ctx.render('admin/carousel/add')
})

// 一定要注意，此处的'pic'要与模板add.html的图片输入框的name一致！！！！！
// 且一定要配置form的属性 enctype="multipart/form-data"
router.post('/doAdd', upload.single('pic'), async (ctx) => {
  // 1. 获取表单数据
  const data = ctx.req.body;

  var title = data.title;
  var img_url = ctx.req.file ? ctx.req.file.path: '';
  var pic = img_url.split('\\').slice(1).join('/'); // 进行格式转换
  var url = data.url;
  var status = data.status;
  var sort =  data.sort || '';
  var lastModified_time = new Date();

  const json = {title,pic,url,status,sort,lastModified_time}
  //console.log(json);

  await DB.insert('carousel',json)

  ctx.redirect(ctx.state.__ROOT__ + '/admin/carousel')

})

router.get('/edit', async (ctx) => {
  const id = ctx.query.id;
  const result = await DB.find('carousel', {
    '_id': DB.getObjectID(id)
  })

  await ctx.render('admin/carousel/edit', {
    result: result[0],
    prevPage: ctx.state.G.prevPage
  })
})

router.post('/doEdit', upload.single('pic'), async (ctx) => {
  // 1. 获取表单数据
  const data = ctx.req.body;
 // console.log(data)

  var id = data.id;
  var prevPage = data.prevPage || '';
  var title = data.title;
  var img_url = ctx.req.file ? ctx.req.file.path: '';
  var pic = img_url.split('\\').slice(1).join('/'); // 进行格式转换
  var url = data.url;
  var status = data.status;
  var sort =  data.sort || '';
  var lastModified_time = new Date();

  let json = {};
  if(pic === ''){
    json = {title,url,status,sort,lastModified_time}
  }else{
    json = {title,pic,url,status,sort,lastModified_time}
  }

   await DB.update('carousel',{"_id":DB.getObjectID(id)},json)

  if(prevPage === ''){
    ctx.redirect(ctx.state.__ROOT__ + '/admin/carousel')
  }else{
    ctx.redirect(prevPage)
  }
  

})



module.exports = router.routes();