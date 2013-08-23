/*
name: Jerome Biotidara
Description: This is to be pasted on the windows azure Scheduler script
*/

function checkForNewData() {
    var channelExpiration=(Number)(Date.now())/1;
    var query = "SELECT AccountID, ChannelURI FROM dashAccounts where channelExpiration>" + channelExpiration;
    mssql.query(query, {
        success: function(results) {
            for(var i=0;i<results.length;i++)
            {
                makeCallToDash(results[i]);
            }
            
            
            
            /*if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    channelTable.del(results[i].Id);
                    console.log('Deleted duplicate channel:' + 
                    results[i].Uri);
                }
            } else {
                console.log('No duplicate rows found.');
            }*/
        }
    });
    
    
    function makeCallToDash(Account)
    {
        var http = require('http');
        var IpAddress="198.101.207.173";
        var options = {
              host: IpAddress,
              path: '/jerome/checkForNewData.php?win_id='+Account.AccountID
            };
			
		var callback = function(response) {
		  var str = '';

		  //another chunk of data has been recieved, so append it to `str`
		 response.on('data', function (chunk) {
			str += chunk;
		  });

		  //the whole response has been recieved, so we just print it out here
		  response.on('end', function () {
			try
			{
				var dataStatus=JSON.parse(str);
				if(dataStatus.isDataDifferent)
				{
					 push.wns.sendToastText04(Account.ChannelURI,{text1:"Download"},{
                                                success: function(){console.log("success in reporting "+Account.AccountID)},
                                                error: function(){console.log("failure in reporting "+Account.AccountID)},,
                                                headers: wns_headers, 
                                                launch: launch_uri,
                                                duration: duration_time 
                                            }
                                        );
				}
			}
			catch(e)
			{
				console.log(e);
			}
		  });
		}
        
        http.request(options, callback).end();
    }
    //console.warn("You are running an empty scheduled job. Update the script for job 'checkForNewData' or disable the job.");
}