var fs = require('fs')
var cmds=[];
var downs=[];
//ec2-54-203-165-54.us-west-2.compute.amazonaws.com
var host = fs.readFileSync('../appdata/srvs.txt').toString().split('\n');
for(var i=0;i<host.length;i++){
    if(!host[i]) continue;
    var cmd = 'ssh -i bda2014032.pem ubuntu@'+host[i]+' \'sudo add-apt-repository ppa:chris-lea/node.js;sudo apt-get update;sudo apt-get install -y build-essential;sudo apt-get install -y git;git clone https://github.com/mike442144/spider.git; sudo apt-get install -y nodejs;sudo apt-get install -y npm;cd spider;mkdir node_modules;mkdir result;cd result;mkdir ganjijob;mkdir ganjicompany;mkdir 58job;mkdir 58company;cd ../;npm config set registry http://registry.npmjs.org/;sudo npm install -d;cd src;\\cp utils.js ..node_modules/jsdom/lib/jsdom/browser/;node pc_ganji_job.js '+i*5+' 5\'';
    cmds.push(cmd);
    var down = 'scp -i bda2014032.pem ubuntu@'+host[i]+':/home/ubuntu/spider/result/ganji.original.txt ' + i+'.ganji.original.txt';
    downs.push(down);
    console.log(cmd);
    console.log(down);
}
