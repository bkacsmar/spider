var fs = require('fs')
var readline = require('readline');

var stream = fs.createReadStream("TextFile1.txt");
var rl = readline.createInterface({
    input:stream,
    output:process.stdout
});
var cities={};
rl.on('line',function(line){
    if(!line) return;
    var pah = line.split(' ');
    var id = Number(pah[0].match(/\d+/));
    var name = pah[1];
    cities[id]=name;
});

var hotels=[];
var hotel=function(){
    this.id = 0;
    this.name = "";
    this.shortName = "";
    this.star="";
    this.currency = "";
    this.lowPrice="";
    this.points="";
    this.zoneName="";
    this.isGift=false;
    this.isNew=false;
    this.isFan=false;
    this.fanPrice=0;
    this.fanType="";
    this.isQuan=false;
    this.quanPrice=0;
    this.quanType="";
    this.isCu = false;
    this.isMp=false;
    this.isMorning=false;
    this.isStar=false;
    this.isRoomFull=false;
};
var pageCount=1;
var curPageIdx=1;

var file = fs.readFile("response_format.json","utf8",function(err,data){
	if(err)
		return console.log(err);
	var obj = JSON.parse(data);
	var fileds = obj.Data[0];// array 
	var data_arr = obj.Data[1];
	var hotelList = data_arr[0];
	var totalCount = data_arr[1];
	pageCount = Number(data_arr[2]);
	var currentPos = data_arr[3];
	var isInterested = data_arr[4];
	for(var i=0;i<hotelList.length;i++){
	    var h = new hotel();
	    var h_arr = hotelList[i];
	    h.id=h_arr[0];
	    h.name=h_arr[2];
	    h.shortName=h_arr[3];
	    h.star = h_arr[5];
	    h.currency=h_arr[6];
	    h.lowPrice=h_arr[7];
	    h.points = h_arr[8];
	    h.zoneName = h_arr[9];
	    h.isGift = h_arr[10]==1?true:false;
	    h.isNew = h_arr[11]==1?true:false;
	    h.isFan = h_arr[12]==1?true:false;
	    h.fanPrice=h_arr[13];
	    h.isQuan = h_arr[14]==1?true:false;
	    h.quanPrice = h_arr[15];
	    h.quanType = h_arr[16];
	    h.isCu = h_arr[17]==1?true:false;
	    h.isMp=h_arr[18]==1?true:false;
	    h.isMorning=h_arr[19]==1?true:false;
	    h.isStar = h_arr[20]==1?true:false;
	    hotels.push(h);
	}
	
	console.log(hotels.length);//HotelLists
	console.log(totalCount);//TotalCount
//	console.log(totalPage);//TotalPage
	console.log(currentPos);//currentPos
	console.log(isInterested);//isInterested

    
});
