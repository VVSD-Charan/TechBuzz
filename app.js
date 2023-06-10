//Import express
const express = require("express");
//Import body parser
const bodyParser = require("body-parser");
//Import ejs
const ejs = require("ejs");
//Import loadash for converting strings to lowercase or uppercase by ignoring symbols
const _ =require("lodash");
//Import mongoose
const mongoose=require('mongoose');

//Home display content
const homeStartingContent = `Welcome to TechBuzz, your ultimate destination for staying up-to-date with the latest trends in technology. Our blog is dedicated to providing insightful and engaging content that covers a wide range of topics related to trending technologies.At TechBuzz, we believe that technology is constantly evolving, and it's essential to stay informed about the latest developments shaping our digital world. Our team of passionate tech enthusiasts and industry experts curates thought-provoking articles, in-depth analyses, and practical guides to help you navigate the ever-changing landscape of technology.`;

// About page display content 
const aboutContent = `Welcome to TechBuzz, your ultimate destination for staying up-to-date with the latest trends in technology. Our blog is dedicated to providing insightful and engaging content that covers a wide range of topics related to trending technologies.

At TechBuzz, we believe that technology is constantly evolving, and it's essential to stay informed about the latest developments shaping our digital world. Our team of passionate tech enthusiasts and industry experts curates thought-provoking articles, in-depth analyses, and practical guides to help you navigate the ever-changing landscape of technology.

Whether you're a seasoned tech professional or just starting your journey into the digital realm, TechBuzz offers something for everyone. From artificial intelligence and blockchain to virtual reality and cybersecurity, we delve into the most exciting and disruptive technologies of our time. Our aim is to simplify complex concepts and make them accessible to our readers, empowering them to embrace the possibilities and opportunities that technology presents.

Join our vibrant community of tech enthusiasts, innovators, and curious minds as we explore groundbreaking inventions, emerging trends, and transformative ideas. Get ready to immerse yourself in the world of TechBuzz, where knowledge meets inspiration and technology takes center stage.`;

// Contact page display content 
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Use express 
const app = express();
// Set view engine to ejs  
app.set('view engine', 'ejs');
// Use body parser to fetch data from forms 
app.use(bodyParser.urlencoded({extended: true}));
// Use static files like css 
app.use(express.static("public"));

//Global variables
let posts=[];

//Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
   console.log("Database connection successful");
});
//Schema of db
const postSchema=new mongoose.Schema({
   title:String,
   titlelc:String,
   content:String
});
//Model
const Post=mongoose.model('blogPost',postSchema);
//Some data to test
// const post1=new Post({
//    title:"Python",
//    content:"Python is usually used for creating sites and programming, task robotization, information investigation, and information representation. Since it's moderately simple to learn, Python has been taken on by numerous non-software engineers like bookkeepers and researchers"
// });
// const post2=new Post({
//    title:"JavaScript",
//    content:"JavaScript is typically inserted into HTML when used on the web, either directly in the file in an HTML tag, or linkedto a separate file containing the script. JavaScript, as a full featured scripting language, can be used to provide functionality to a website. "
// });
// Post.insertMany([post1,post2]).then((data)=>{
//    console.log("Insertion successful");
// }).catch((err)=>{
//    console.log("Insertion failed");
// });
// Post.find().then((data)=>{
//    console.log(data);
// }).catch((err)=>{
//    console.log(err);
// });


app.listen(3000, (err)=>{
   if(err){
      throw err;
   }
   console.log("Server started on port 3000");
});

app.get('/posts/:topic',(request,response)=>{
    var topic=_.lowerCase(request.params.topic);

   //  for(let i=0;i<posts.length;i++)
   //  {
   //    if(_.lowerCase(topic)===_.lowerCase(posts[i].title))
   //    {
   //       var post=posts[i];
   //       response.render("post",{post});
   //    }
   //  }

    Post.findOne({titlelc:topic}).then((Blogpost)=>{
       response.render("post",{Blogpost});
    }).catch((err)=>{
      response.redirect("/");
    })
});

app.get('/',(request,response)=>{
    Post.find().then((Blogpost)=>{
      response.render("home",{homeStartingContent,Blogpost});
    }).catch((err)=>{
      response.redirect("/");
    })
});

app.get('/about',(request,response)=>{
  response.render("about",{aboutContent});
});

app.get('/contact',(request,response)=>{
  response.render("contact",{contactContent});
});

app.get('/compose',(request,response)=>{
  response.render("compose");
});

app.post('/compose',(request,response)=>{
   // const post = {
   //    title : request.body.postTitle,
   //    content : request.body.postBody
   // };
   // posts.push(post);

   const post = new Post({
      title : request.body.postTitle,
      titlelc : _.lowerCase(request.body.postTitle),
      content : request.body.postBody
   });
   post.save().then(()=>{
      console.log("Posted successfully");
   }).catch((err)=>{
      console.log("Failed to post");
   });

   response.redirect("/");
});


app.post('/post',(request,response)=>{
   var uTitle=request.body.uTitle;
   var uContent=request.body.uContent;

   console.log(uTitle+" "+uContent);
   Post.findOneAndUpdate({title:uTitle},{content:uContent},{new:true}).then((data)=>{
      console.log(data);
   });

   response.redirect('/');
});