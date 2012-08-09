using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using PushNotificationServiceTester.ServiceReference1;
using PushNotificationServiceTester.ServiceReferenceProd;
using System.Diagnostics;

namespace PushNotificationServiceTester
{
    class Program
    {
        static void Main(string[] args)
        {
            PushNotificationServiceClient client = new PushNotificationServiceClient();
            //Debug.WriteLine(client.GetData(1));

            Debug.WriteLine(client.NotifyUser("23e1080bd6e0ebfc"));
            //String.Format("<?xml version='1.0' encoding='utf-8'?><toast><visual><binding template=\"ToastImageAndText01\"><image id=\"1\" src=\"{0}\" alt=\"Placeholder image\"/><text id=\"1\">{1}</text></binding></visual></toast>", imageSource, text);
            //string pushType = "toast";
            //string notificationContent = "<?xml version='1.0' encoding='utf-8'?><toast><visual><binding template=\"ToastImageAndText01\"><image id=\"1\" src=\"{0}\" alt=\"Placeholder image\"/><text id=\"1\">Hi there</text></binding></visual></toast>";

            //string pushType = "raw";
            //string notificationContent = "<?xml version=\"1.0\" encoding=\"utf-8\"?><root></root>";

            //Debug.WriteLine(client.NotifyChannelByUri("https://bn1.notify.windows.com/?token=AgUAAAC3wqHFzQhu%2b5JpVqH8NE7ntF%2b%2bmE2Kh%2fKIAvpcs8RUyd%2blUdBwZzvVqd6goEPCNHuqvlr%2fieQkYMEb9YeImROn4qQxRMASN7luQlfsKqhyJscHb3e3f%2fvOCqr1vG43UgA%3d", pushType, notificationContent));
                                                       
            // Use the 'client' variable to call operations on the service.

            // Always close the client.
            client.Close();
        }
    }
}
