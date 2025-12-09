const Blog = require("../models/Blog");
const Discussion = require("../models/communityDiscussion");
const fs = require("fs");
const path = require("path");


module.exports.community =  async (req,res)=>{
    const discuss = await Discussion.find({});
     const blogs = await Blog.find({});
    res.render("retires/community.ejs" ,{discuss , blogs} );
}

module.exports.addDiscussion = async (req ,res ,next)=>{

  const { title , author , Description } = req.body;

    const Dx = await Discussion.create({
      title: title,
      author: author,
      content: Description,
      owner: req.user._id
    });

    await Dx.save();

   req.flash("success", "Post Uploaded!!");
  res.redirect("/community");
} 


module.exports.addBlog = async (req ,res , next) => {

 if (!req.file) {
    req.flash("error", "File not received");
    return res.redirect("/community");
}

    let url  = req.file.path ; 
  let filename = req.file.filename;

    const newRecord = new Blog({
      title: req.body.title,
  caption : req.body.Caption,
   });
    newRecord.owner = req.user._id;
  newRecord.image = {url , filename};

  await newRecord.save();
   req.flash("success", "Blog uploaded !");
  res.redirect("/community");
}


module.exports.likeCount = async(req,res,next)=>{
  

  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ 
      ok: false, 
      message: "Please login first" 
    });
  }

const discuss = await Discussion.findById(req.params.id);
  const userId = req.user._id;

  // Already liked? → Unlike
  if (discuss.likedBy.includes(userId)) {
    discuss.likedBy.pull(userId);
    discuss.likes -= 1;
    await discuss.save();
    return res.json({ok: true, liked: false, likes: discuss.likes });
  }

  // Not liked yet → Like
  discuss.likedBy.push(userId);
  discuss.likes += 1;
  await discuss.save();

  res.json({ ok : true ,liked: true, likes: discuss.likes });
}

module.exports.likebCount = async(req,res,next)=>{
  

  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ 
      ok: false, 
      message: "Please login first" 
    });
  }

const discuss = await Blog.findById(req.params.id);
  const userId = req.user._id;

  // Already liked? → Unlike
  if (discuss.likedBy.includes(userId)) {
    discuss.likedBy.pull(userId);
    discuss.likes -= 1;
    await discuss.save();
    return res.json({ok: true, liked: false, likes: discuss.likes });
  }

  // Not liked yet → Like
  discuss.likedBy.push(userId);
  discuss.likes += 1;
  await discuss.save();

  res.json({ ok : true ,liked: true, likes: discuss.likes });
}

module.exports.search = async (req ,res ,next)=>{
    const query = req.query.q?.trim() || "";

  let results = [];
  let blogres = [];
  if (query) {
    results = await Discussion.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } }
      ]
    });
    blogres = await Blog.find({
      $or: [{caption : {$regex : query , $options: "i"}}
      ]
    })
  }

  res.render("retires/search.ejs", { 
    discuss: results,
    blogs: blogres, 
    currUser: req.user
  });
}

module.exports.ShowDis = async (req,res)=>{
 let {id} = req.params;
 const list = await  Discussion.findById(id).populate("owner");
 if(!list){
    req.flash("error" , "Discussion Not found!!!");
    res.redirect("/community");
 }
 res.render("retires/show.ejs",{list});
}

module.exports.ShowBlog = async (req,res)=>{
 let {id} = req.params;
 const list = await  Blog.findById(id).populate("owner");
 if(!list){
    req.flash("error" , "Discussion Not found!!!");
    res.redirect("/community");
 }
 res.render("retires/show.ejs",{list});
}

module.exports.DelBlog = async(req,res,next)=>{
   const { id } = req.params;

  const blog = await Blog.findById(id);

  // Blog not found
  if (!blog) {
     req.flash("error","not found!");
     return res.redirect(`/community/bl/:${id}`);
  }

  // CHECK: logged in user must be the blog owner
  if (!blog.owner._id.equals(req.user._id)) {
        req.flash("error", " You are not allowed to delete it..");
     return res.redirect(`/community/bl/:${id}`); 
     }

  await Blog.findByIdAndDelete(id);

        req.flash("success", "Deleted!!!");
  res.redirect("/community");
}

module.exports.DelDis = async(req,res,next)=>{
   const { id } = req.params;

  const blog = await Discussion.findById(id);

  // Blog not found
  if (!blog) {
     req.flash("error","not found!");
     return res.redirect(`/community/dis/:${id}`);
  }

  // CHECK: logged in user must be the blog owner
  if (!blog.owner._id.equals(req.user._id)) {
        req.flash("error", " You are not allowed to delete it..");
     return res.redirect(`/community/dis/:${id}`); 
     }

  await Discussion.findByIdAndDelete(id);

        req.flash("success", "Deleted!!!");
  res.redirect("/community");
}

module.exports.Editbl = async(req ,res, next )=>{
     let {id} = req.params;
    const list = await  Blog.findById(id);
    if(!list){
        req.flash("error" , "Not found!!!");
        res.redirect(`/community/bl/:${id}`);
     }
  res.render("retires/edit.ejs"  , {list});
}
module.exports.Editdis = async(req ,res, next )=>{
     let {id} = req.params;
    const list = await  Discussion.findById(id);
    if(!list){
        req.flash("error" , " Not found!!!");
        res.redirect(`/community/dis/:${id}`);
     }
  res.render("retires/edit.ejs"  , {list});
}

module.exports.updatebl = async (req,res)=>{
    
    let {id} = req.params;
     let blog  = await  Blog.findById(id);

  blog.title = req.body.title;
  blog.caption = req.body.content;
await blog.save();

     req.flash("success", "Blog Updated!");
    res.redirect(`/community/bl/${id}`);
}

module.exports.updatedis = async (req,res)=>{
    
    let {id} = req.params;
     let blog  = await  Discussion.findById(id);

 blog.title = req.body.title;
  blog.content = req.body.content;
await blog.save();

     req.flash("success", "Discussion Updated!");
    res.redirect(`/community/dis/${id}`);
}

