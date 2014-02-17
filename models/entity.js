var helper = require('../helpers/webhelper.js')
exports.hotel=function(){
    this.city="";
    this.id = 0;
    this.name = "";
    this.shortName = "";
    this.star=0;
    this.currency = "";
    this.lowPrice="";
    this.points="";
    this.zoneName="";
    this.picCount=0;
    this.commentCount=0;

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

    
    this.faclPoints= "0";//设施
    this.raAtPoints = "0";//环境
    this.ratPoints = "0";//卫生
    this.servPoints = "0";//服务
    this.rooms = [];
};
exports.hotel.prototype.toString=function(){
    var sb="";
    for(var i=0;i<this.rooms.length;i++){
        sb+=this.city+",";
        
        sb+=this.name+",";
        
        sb+=(this.zoneName==null?"":this.zoneName)+",";
        
        sb+=this.star+',';
        
        sb+=this.rooms[i].name+',';
        
        sb+=this.rooms[i].price+',';
        
        sb+=this.commentCount+',';
        
        sb+=this.picCount+',';
        
        sb+=this.points+',';
        
        sb+=this.faclPoints+',';
        
        sb+=this.raAtPoints+',';
        
        sb+=this.servPoints+',';
        
        sb+=this.ratPoints+',';
        
        var b;
        if(this.rooms[i].breakfast=="单早")
            b=1;
        else if(this.rooms[i].breakfast=="双早")
            b=2;
        else b=0;
        sb+=b+',';
        
        if(this.rooms[i].gift)
            sb+=this.rooms[i].gift+',';
        else sb+=',';
        
        sb+=(this.isCu==0?"N":"Y")+',';
        
        if(this.rooms[i].fanPrice)
            sb+=this.rooms[i].fanPrice+',';
        else sb+=",";
        
        sb+=(this.rooms[i].payType==0?"Y":"N");
        sb+='\r\n';
    }
    return sb;
}

exports.room = function(){
    this.id=0;
    this.name="";
    this.breakfast="";
    this.fan="";
    this.gift="";
    this.isCu=0;
    this.payType=1;
    this.price="";
};

exports.flight = function(){
    this.aPortCode='';
    this.aTerminal='';
    this.aTime='';
    this.aaname='';
    this.airlineCode='';
    this.aname='';
    this.cmpName='';
    this.cabins=[];
    this.ctinfo=[];
    this.dPortCode='PEK';
    this.dTerminal=null;
    this.dTime='2014/2/23 6:35:00';
    this.daname='首都';
    this.flag=0;
    this.flightNo='HO1252';
    this.planeType='320';
    this.puncRate=93;
    this.stopCities=null;
    this.price = '';
};

exports.flight.prototype.toString=function(){
    var sb = new helper.StringBuffer();
    for(var i=0;i<this.cabins.length;i++){
        sb.append(this.dname);
        sb.append(',');
        sb.append(this.aname);
        sb.append(',');
        sb.append(this.cmpName);
        sb.append(this.flightNo);
        sb.append(',');
        sb.append(this.dTime);
        sb.append(',');
        sb.append(this.aTime);
        sb.append(',');
        sb.append(this.price);
        sb.append(',');
        sb.append(this.cabins[i].tui.replace(/[,]*/g,''));
        sb.append(',');
        sb.append(this.cabins[i].gai.replace(/[,]*/g,''));
        sb.append(',');
        sb.append(this.cabins[i].ctype);
        sb.append(',');
        sb.append(this.cabins[i].price);
        sb.append(',');
        sb.append(this.cabins[i].tCount);
        sb.append('\r\n');
    }
    var result = sb.toString();
    sb=null;
    return result;
};