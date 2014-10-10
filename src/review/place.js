var fs = require('fs')
var cheerio = require("cheerio")
var helper = require('../../helpers/webhelper.js')
var entity = require('../../models/entity.js')

function Place(){
    this.resultDir = "../../result/";
    this.dataDir = "../../appdata/";
    this.resultFile = "place.txt";
    this.cityFile = "place_city.txt";
    this.categoryFile = "place_categories.txt";
    this.cities = [];
    
    this.categories = [];
    this.taskQueue = [];
    this.interval = [0,500];
    this.doneItems = {};
    
    this.query = function(cateId,cateName,cateCode,cityName,cityCode,pageIdx){
	this.categoryId=cateId
	//this.what=encodeURIComponent(cateName.trim())
	this.whatUrl=cateCode
	//this.where=encodeURIComponent(cityName.trim())
	this.whereUrl=cityCode
	this.page=pageIdx || 1
	this.sort = ""
    }
}

Place.prototype.init = function(){
    var doneCount = 0;

    var args = process.argv.slice(2);
    if(args.length>0){
	this.startIdx = args[0];
    }
    if(args.length>1){
	this.count = args[1];
    }
    
    this.cities = fs.readFileSync(this.dataDir+this.cityFile).toString().split('\n').filter(function(line){
	return line;
    }).map(function(line){
	var vals = line.split(',');
	return {enname:vals[0],code:vals[1],name:vals[2]};
    });
    this.categories = fs.readFileSync(this.dataDir+this.categoryFile).toString().split('\n').filter(function(line){
	return line;
    }).map(function(line){
	var vals = line.split(',');
	return {code:vals[1],id:vals[2],enname:vals[0],name:vals[3]};
    });
    if(!fs.existsSync(this.resultDir+this.resultFile)){
	console.log("[DONE COUNT] %d",doneCount);
	return;
    }
    fs.readFileSync(this.resultDir+this.resultFile).toString().split('\n').map(function(line){
	if(line){
	    return line.split(',')[2];
	}
	return "";
    }).reduce(function(pre,cur){
	pre[cur]=true;
	++doneCount;
	return pre;
    },this.doneItems);
    //console.log(this.doneItems);
    console.log("[DONE COUNT] %d",doneCount);
    console.log("[CITIES] %d",this.cities.length);
    console.log("[CATEGORIES] %d",this.categories.length);
}

Place.prototype.start = function(){
    this.init();
    for(var i=0;i<this.cities.length;i++){
	for(var j=0;j<this.categories.length;j++){
	    if(this.cities[i] && this.categories[j])
		this.taskQueue.push({city:this.cities[i],cate:this.categories[j]});
	}
    }
    this.startIdx = Number(this.startIdx) || 0;
    this.count = Number(this.count) || this.taskQueue.length;
    this.taskQueue = this.taskQueue.slice(this.startIdx,this.startIdx+this.count);
    console.log("[TASKS] %d",this.taskQueue.length);
    
    this.wgetList();
}
Place.prototype.wgetList = function(t){
    if(!t){
	t = this.taskQueue.shift();
	t.pageIdx = 1;
	t.shopCount=-1;
	t.reviews = 0;
	t.shops = [];
	t.photoCount = 0;
    }
    var id = t.cate.id;
    //t.onlyList = id==55||id==70||id==90;
    //t.isHotel = id==60;
    var path = '/search/resultmore'+t.cate.id+'/'+t.city.code+'/p'+t.pageIdx;
    //if(t.isHotel){
	//path = "/"+t.city.code+"/hotel/p"+t.pageIdx;
    //}
    //var opt = new helper.basic_options('www.dianping.com',path);
    var q = new this.query(t.cate.id,t.cate.name,t.cate.code,t.city.name,t.city.code,t.pageIdx);
    var opt = new helper.basic_options('www.place.vn',"/search/resultmore",'POST',false,true,q);
    console.log(opt);
    console.log("[GET] %s,%s: %d",t.city.enname,t.cate.enname,t.pageIdx);
    helper.request_data(opt,q,function(data,args,res){
	that.processList(data,args,res);
    },t);
}

Place.prototype.processList = function(data,args,res){
    if(res.statusCode==403){
	console.log("IP has been forbidden");
	return;
    }
    if(!data){
	console.log("data empty");
	this.wgetList();
	return;
    }

    var $ = cheerio.load(data);
    if(args[0].shopCount==-1){
	//var m=
	//args[0].shopCount = m;
	//args[0].pageCount = Math.min(Math.ceil(m/15),50);
    }
    var itemSelector;
    itemSelector = ".place-item";
    $(itemSelector).each(function(){
	var shop = {};
	var item = $("ul.place-info li.first a",this);
	shop.path = item.attr("href");
	shop.name = item.attr("title");
	shop.star = Number($("ul.place-info li rate-score",this).text());
	shop.reviews = Number($("ul.place-info li span.comment-no",this).text());
	
	//if(!that.doneItems[shop.path]){
	//    var record = [args[0].city.name,args[0].cate.name,shop.path,shop.reviews,'\n'].join();
	//    fs.appendFileSync(that.resultDir+that.resultFile,record);
	//    console.log("[DONE] ",record);
	//}
	args[0].reviews+=shop.reviews;
	//args[0].photoCount+=shop.photoCount;
	args[0].shops.push(shop);
    });
    console.log("[DATA] %s, %s, %d",args[0].city.enname,args[0].cate.enname,args[0].pageIdx);
    this.wgetDetail(args[0]);
}

Place.prototype.wgetDetail = function(task){
    if(task.shops.length==0){
	++task.pageIdx;
	this.wgetList(task);
	return;
    }
    
    var shop = task.shops.shift();
    var opt = new helper.basic_options("www.place.vn",shop.path);
    console.log("[GET] %s",shop.name);
    helper.request_data(opt,null,function(data,args,res){
	that.processDetail(data,args,res);
    },[task,shop]);
}

Place.prototype.processDetail = function(data,args){
    if(!data){
	console.log("detail data empty.");
    }
    var $ = cheerio.load(data);
    args[1].photoCount = $("li.thumbnail").length;
    
    var record = [args[0].city.enname,args[0].cate.enname,args[1].path,args[1].star,args[1].reviews,args[1].photoCount,'\n'].join();
    fs.appendFileSync(this.resultDir+this.resultFile,record);
    console.log("[DONE] %s",record);
    setTimeout(function(){
	that.wgetDetail(args[0]);
    },1000);
}

var instance = new Place();
var that = instance;
instance.start();
