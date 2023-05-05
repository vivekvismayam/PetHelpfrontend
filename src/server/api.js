const helmet = require('helmet');
const express = require('express');
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(express.json());


const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3001'
}));


const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3001;


let image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5si8TaIBZLiUvSUGQlbgwZhmVdiUeH2oEEw&usqp=CAU';
let itemset=[{Id:1,Item:'PetFood',desc:'Dry food - Pedegree,Drools, Active,purepet',buyafterday:3,numberOfPack:1,outOfStock:false,imgurl:image},
        {Id:2,Item:'Food Mix',desc:'Wet food to mix with white meals',buyafterday:7,numberOfPack:1,outOfStock:false,imgurl:image},
        {Id:3,Item:'Treats',desc:'Other treats- Jumbo bone, Meat jerky',buyafterday:0,numberOfPack:0,outOfStock:true,imgurl:image},
        {Id:4,Item:'Biscuits',desc:'Biscuts for health',buyafterday:0,numberOfPack:0,outOfStock:true,imgurl:image},
        {Id:5,Item:'Calcium Suppliments',desc:'Calcium bone, tablets etc',buyafterday:0,numberOfPack:0,outOfStock:true,imgurl:image},
        {Id:6,Item:' Skin Suppliments',desc:'Himalaya Fur glow, enhance etc',buyafterday:0,numberOfPack:0,outOfStock:true,imgurl:image}];

let authorizelist=[{id:'U01',username:'vivek',password:'vivek'},
                {id:'U02',username:'vismaya',password:'vismaya'},{id:'U03',username:'vishnu',password:'vishnu'}];

//Authorization
app.post('/api/v1/authorize', (req, res) => {
    console.log(req.body.username);
    console.log(req.body.pass);
    let auth=false;
    let userId;
    authorizelist.map(item=>{
        if(item.username==req.body.username&&item.password==req.body.pass){
            auth=true;
            userId=item.id;
        }
        return item;
    })
    res.json({authorization:auth,userId:userId||'Invalid'});
});
//Get All petitems 
app.get('/api/v1/petfood', (req, res) => {
    res.json(itemset);
});
//PUT Petitems by ID
app.put("/api/v1/updatestock/:id", (req, res) => {
    console.log("update Item " + req.params.id);
    let buyafterday=req.body.buyafterday;
    let numberOfPack=req.body.numberOfPack;
    let outOfStock=req.body.outOfStock;
    console.log("update Item | " + buyafterday+' |'+numberOfPack+' |'+outOfStock);
    let itemFound;
    let updateditem = itemset.map((item) => {
        let itemCopy = { ...item };
        if (item.Id == req.params.id) {
            itemCopy.numberOfPack = numberOfPack||0;
            itemCopy.buyafterday = buyafterday||0;
            itemCopy.outOfStock = outOfStock||true;
            itemFound={...itemCopy};
        }
        return itemCopy;
    });
    
    //here update in db
    itemset = [...updateditem];
    res.status(200).json(itemFound);
});

app.listen(PORT, () =>
    console.log(
        `✅  API Server started: http://${HOST}:${PORT}/api/v1/authorize`
    )
);

