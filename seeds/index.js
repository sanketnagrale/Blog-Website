const mongoose = require('mongoose');
const cities = require('./cities');
const {places , descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');


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

const sample = (array)=>    array[Math.floor(Math.random()*array.length)];


const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i =0;i<50;i++)
    {
        const category = 'All';
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            author : '6088dca09dba1b06e45948fc',
            location : `${cities[random1000].city} , ${cities[random1000].state}` , 
            title : `${sample(descriptors)} ${sample(places)}`,
            image : 'https://source.unsplash.com/collection/483251',
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio quod maiores earum, alias facere iste distinctio optio itaque unde. Accusantium debitis vero adipisci soluta consectetur veniam perferendis iste saepe recusandae!',
            category
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});