const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const { findById } = require('./models/campground');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/blog-website', {
    useNewUrlParser: true,
    useCreateIndex : true , 
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error" , console.error.bind(console, "connection error"));
db.once("open",()=>{
    console.log("databse connected")
});

const app = express();

app.engine('ejs',ejsMate);
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));


app.get('/' , (Req , res)=>{
    res.render('home');
});

app.get('/blogs', catchAsync(async(req , res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds});
}));

app.get('/blogs/new' , (req , res)=>{
    res.render('campgrounds/new');
});

app.post('/blogs' , catchAsync(async(req , res , next)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/blogs/${campground._id}`);
}))



app.get('/blogs/:id', catchAsync(async(req , res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
}));

app.get('/blogs/:id/edit', catchAsync(async(req , res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));

app.put('/blogs/:id',catchAsync(async (req , res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground} );
    res.redirect(`/blogs/${campground._id}`);
}));

app.delete('/blogs/:id', catchAsync(async (req , res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/blogs')
}));

app.use((err , req , res , next)=>{
    res.send(' you got error');
});

app.listen(3000 , ()=>{
    console.log('port working');
});