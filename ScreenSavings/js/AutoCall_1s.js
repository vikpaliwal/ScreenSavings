/*
name: Jerome Biotidara
Description: This is to be pasted on the windows azure Scheduler script
*/
var request = require('request');
function checkForNewData() {
    var channelExpiration=(Number)(Date.now())/1;
    var query = "SELECT AccountID, ChannelURI FROM dashAccounts where channelExpiration>" + channelExpiration;
    mssql.query(query, {
        success: function(results) {
            for(var i=0;i<results.length;i++)
            {
                justCall(results[i]);
            }
        },
    });  
}

function justCall(Account)
{
    var httpRequest = require('request');
    var IpAddress="198.101.207.173";
    var path='/jerome/checkForNewData.php?win_id='+Account.AccountID;
    var getRequestString ="http://"+IpAddress+path;
    
    console.log("before httpRequest call url is "+ getRequestString);//This shows in Log
    
    httpRequest(getRequestString,function(err, response, body){
    
         console.log("in httpRequest function");//not showing in log
         if (err) {
                console.log("weird error jerome"+getRequestString);//not showing in log
            } else if (response.statusCode !== 200) {
                    console.log("invalid Data");//not showing in log
            } else {
                console.log("data sent")//not showing in log
            }
     })
}
