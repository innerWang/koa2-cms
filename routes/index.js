const router = require('koa-router')();
const DB = require('../module/db.js');
const url = require('url');

//配置全局
router.use(async (ctx,next)=>{
  const navResult = await DB.find('nav',{status:'1'},{},{
    sortBy:{
      sort: 1
    }
  })
  ctx.state.nav = navResult;
  const pathname = url.parse(ctx.url).pathname
  ctx.state.pathname = pathname

  const setInfo = await DB.find('setting',{})
  ctx.state.setting = setInfo[0]

  await next()
})



router.get('/',async (ctx) =>{

  const carouselResult = await DB.find('carousel',{status:'1'},{},{
    sortBy:{
      sort: 1
    }
  })

  await ctx.render('default/index',{
    carousel: carouselResult
  });
})


router.get('/service',async (ctx) =>{
  const service = await DB.find('article',{'pid':'5cad8cc8c565362ad84191c1'});

  await ctx.render('default/service',{
    service
  });
})

/** 
 * /content/id=123   路由为/content     对应get传值       ctx.query 得到对象{id:'123'}
 * /content/123      路由为/content/:id 对应动态路由传值   ctx.params 得到对象{id:'123'}
 * */ 
router.get('/content/:id',async (ctx) =>{
  const id = ctx.params.id;
  const content = await DB.find('article',{'_id':DB.getObjectID(id)});
  /** 
   * 如何在对应文章页面给所属分类加样式
   * 1. 根据文章获取其所属分类
   * 2. 根据文章所属分类去导航表中查找当前分类对应的url
   * 3. 把url赋值给全局变量ctx.state.pathname
  */
  
  const cateResult = await DB.find('article_classify',{'_id':DB.getObjectID(content[0].pid)}) 
  let navResult = []
  if(cateResult[0].pid == '0'){
    // 已经是一级分类，直接去查url
    navResult = await DB.find('nav',{'title':cateResult[0].title})
  }else{
    // 是子分类
    const topCate = await DB.find('article_classify',{'_id':DB.getObjectID(cateResult[0].pid)})
    navResult = await DB.find('nav',{$or:[{'title':topCate[0].title},{'title':cateResult[0].title}]})
  }
  ctx.state.pathname = navResult.length >0 ? navResult[0].url : '/';

  await ctx.render('default/content',{
    content: content[0]
  })
})


router.get('/about',async (ctx) =>{
  await ctx.render('default/about');
})

router.get('/news',async (ctx) =>{
  const pid = ctx.query.pid;
  const subcate = await DB.find('article_classify',{'pid':'5cad8bd4c565362ad84191b9'})
  let articleList = [];
  if(pid){
    /***  存在的话就直接查找渲染对应pid的文章列表*/
    articleList = await DB.find('article',{'pid':pid})

  }else{
    //循环获取所有子分类的id
    let subcateIDArr = [];
    for(let i=0;i<subcate.length;i++){
      subcateIDArr.push(subcate[i]._id.toString());
    }
    //获取所有子分类下面的数据
    articleList = await DB.find('article',{'pid':{$in:subcateIDArr}})  
  }

  await ctx.render('default/news',{
    cateList: subcate,
    articleList: articleList,
    pid:pid
  });
})


router.get('/case',async (ctx) =>{
  const pageNum = ctx.query.page || 1;
  const pageSize = 3;
  const pid = ctx.query.pid;
  //获取成功案例下面的所有子分类
  const subcate = await DB.find('article_classify',{'pid':'5cad8c0bc565362ad84191bc'})
  let articleList = [];
  let articleNum = 0;

  if(pid){
    /***  存在的话就直接查找渲染对应pid的文章列表*/
    articleList = await DB.find('article',{'pid':pid},{},{
      pageNum,
      pageSize
    })
    articleNum = await DB.count('article',{'pid':pid})

  }else{
    //循环获取所有子分类的id
    let subcateIDArr = [];
    for(let i=0;i<subcate.length;i++){
      subcateIDArr.push(subcate[i]._id.toString());
    }
    //获取所有子分类下面的数据
    articleList = await DB.find('article',{'pid':{$in:subcateIDArr}},{},{
      pageNum,
      pageSize
    })
    articleNum = await DB.count('article',{'pid':{$in:subcateIDArr}})
    
  }
  await ctx.render('default/case',{
    cateList: subcate,
    articleList: articleList,
    pid:pid,
    page : pageNum,
    totalPages: Math.ceil(articleNum/pageSize)
  });
 
})

router.get('/connect',async (ctx) =>{
  await ctx.render('default/connect');
})

module.exports = router.routes();