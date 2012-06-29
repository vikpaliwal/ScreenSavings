using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WCFClientRuntimeComponent.ScreenSavingsServiceReference;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;

namespace WCFClientRuntimeComponent
{
    public sealed class WCFServiceCaller
    {
        public static string GetAnswer()
        {
            return "The answer is 42.";
        }

        public static IAsyncOperation<string> GetDataAsync(int input)
        {            
            return AsyncInfo.Run<string>((token) => 
                Task.Run<string>(() =>
                {
                    PushNotificationServiceClient client = new PushNotificationServiceClient();
                    var task = client.GetDataAsync( input );
                    client.CloseAsync();
                    return task;
                }, token
                )
            );  
        }

        public static IAsyncOperation<string> RegisterNotificationChannelAsync(string userId, string channelUri, string channelExpiration)
        {
            return AsyncInfo.Run<string>((token) =>
                Task.Run<string>(() =>
                {
                    PushNotificationServiceClient client = new PushNotificationServiceClient();
                    var task = client.RegisterNotificationChannelAsync(userId, channelUri, channelExpiration);
                    client.CloseAsync();
                    return task;
                }, token
                )
            );
        }

    }
}
