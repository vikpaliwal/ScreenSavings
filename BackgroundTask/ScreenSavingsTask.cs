using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Windows.ApplicationModel.Background;
using System.Diagnostics;
using System.Threading.Tasks;
using Windows.Data.Xml.Dom;
using Windows.UI.Notifications;
using System.Net;
using System.IO;
using Windows.Storage;
using Windows.Storage.Streams;
using Windows.Networking.BackgroundTransfer;
using Windows.System.UserProfile;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace BackgroundTask
{
    public sealed class ScreenSavingsTask : IBackgroundTask
    {
        private string tileUpdateURL = "http://198.101.207.173/shilpa/live_tile/live_tile.php";
        //private string lockScreenImageURL = "http://198.101.207.173/gaomin/client/tile_generator_vikas.php?win_id="+"demo";
        private string lockScreenImageURL = "http://198.101.207.173/jerome/tilegenerator/request/tile_generator_vikas.php?win_id=";
        //private string lockScreenImageName = "screen-savings.bmp";
        private string lockScreenImageName = "IntelDash\\lockscreen.bmp";
        BackgroundTaskDeferral deferral = null;
        private int taskCompleted;
        private Object lockTaskCompleted = new Object();
        StorageFolder folder = KnownFolders.DocumentsLibrary;
        private StorageFile lockScreenImageFile;
        public void Run(IBackgroundTaskInstance taskInstance)
        {
            Debug.WriteLine(taskInstance.Task.Name + " started...");

            
            deferral = taskInstance.GetDeferral();
            taskCompleted = 0;
            DownloadLockScreenImageAsync();
            UpdateTilesAsync();

            Debug.WriteLine(taskInstance.Task.Name + " ended...");
        }

        public void UpdateTaskCompleted()
        {
            lock (lockTaskCompleted)
            {
                taskCompleted++;
                Debug.WriteLine("Sub-task Completed: " + taskCompleted);
            }

            if (taskCompleted > 1)
            {
                Debug.WriteLine("BG Task Completed");
                deferral.Complete();
            }
        }

        private async Task<bool> JustTestWriteSuccess(string MyTextToWrite)
        {
            StorageFolder folder = KnownFolders.DocumentsLibrary;
            StorageFile file = await folder.CreateFileAsync("Myfile.txt", CreationCollisionOption.ReplaceExisting);
            using (IRandomAccessStream fileStream = await file.OpenAsync(FileAccessMode.ReadWrite))
            {
                using (IOutputStream outputStream = fileStream.GetOutputStreamAt(0))
                {
                    using (DataWriter dataWriter = new DataWriter(outputStream))
                    {
                        //TODO: Replace "Bytes" with the type you want to write.
                        dataWriter.WriteString(MyTextToWrite);
                        await dataWriter.StoreAsync();
                        dataWriter.DetachStream();
                    }

                    await outputStream.FlushAsync();
                }
            }
            return true;
    }


        private async void CheckForUpdatedData()
        {
            string CheckForUpdateURL = "http://198.101.207.173/jerome/checkForNewData.php?win_id=7da7f5efd78b1158";
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(CheckForUpdateURL);
                HttpWebResponse response = (HttpWebResponse)await request.GetResponseAsync();
                StreamReader reader = new StreamReader(response.GetResponseStream());

                string tileXml = reader.ReadToEnd();

                //Debug.WriteLine(tileXml);

                await JustTestWriteSuccess("Ok Jerome output is " + tileXml[19]);
                if(tileXml[19]=='1')
                { DownloadLockScreenImageAsync(); }
                await JustTestWriteSuccess("Ok Jerome output after Dowload call " + tileXml[19]);
                //XmlDocument xmlDoc = new XmlDocument();
                //xmlDoc.LoadXml(tileXml);
                //TileNotification tileNotification = new TileNotification(xmlDoc);
                //TileUpdateManager.CreateTileUpdaterForApplication().Update(tileNotification);
            }
            catch (Exception ex)
            {
                JustTestWriteSuccess("Weird error jerome Jerome");
                Debug.WriteLine(ex.ToString());
            }
        }

        private async void UpdateTilesAsync()
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(tileUpdateURL);
                HttpWebResponse response = (HttpWebResponse)await request.GetResponseAsync();
                StreamReader reader = new StreamReader(response.GetResponseStream());

                string tileXml = reader.ReadToEnd();
                Debug.WriteLine(tileXml);

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(tileXml);
                TileNotification tileNotification = new TileNotification(xmlDoc);
                TileUpdateManager.CreateTileUpdaterForApplication().Update(tileNotification);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
            }
            finally
            {
                UpdateTaskCompleted();
            }
        }

        private async Task<string> getUserAccount()
        {

            StorageFile file = await folder.GetFileAsync("IntelDash\\User.DashProfile");
            string DataStringFromFile = await Windows.Storage.FileIO.ReadTextAsync(file);
            JObject MyJObject = JObject.Parse(DataStringFromFile);
            JToken MyJObjectToken=MyJObject["Profile"]["UserID"]["AccountID"];
            string MyUserID=MyJObjectToken.ToString();
            await JustTestWriteSuccess("Hey jerome we did it" + MyUserID);
            return MyUserID;
        }
        private async void DownloadLockScreenImageAsync()
        {
            try
            {

                //JustTestWriteSuccess("Jerome.... you called? ");
                string readData = await getUserAccount();
                await JustTestWriteSuccess("DownloadLockScreenImageAsync started data is "+readData);
                lockScreenImageURL += readData;
                Uri source = new Uri(lockScreenImageURL);
                lockScreenImageFile = await folder.CreateFileAsync(lockScreenImageName, CreationCollisionOption.ReplaceExisting);
                BackgroundDownloader downloader = new BackgroundDownloader();
                DownloadOperation download = downloader.CreateDownload(source, lockScreenImageFile);
                await HandleDownloadAsync(download, true);
            }
            catch (Exception ex)
            {
                JustTestWriteSuccess("DownloadLockScreenImageAsync was made but failed" + ex.ToString());
                Debug.WriteLine(ex.ToString());
                UpdateTaskCompleted();
            }
        }

        private async void DownloadProgress(DownloadOperation download)
        {
            /*Debug.WriteLine(String.Format("Progress: {0}, Bytes: {1}, Status: {2}", download.Guid, download.Progress.BytesReceived,
                                    download.Progress.Status));*/

            
            if ((download.Progress.Status == BackgroundTransferStatus.Completed)
                 || (download.Progress.BytesReceived == download.Progress.TotalBytesToReceive))
            {
                
                await LockScreen.SetImageFileAsync(lockScreenImageFile);
                Debug.WriteLine("LockScreen Updated");
                UpdateTaskCompleted();
            }
        }

        private async Task HandleDownloadAsync(DownloadOperation download, bool start)
        {
            try
            {
                //JustTestWriteSuccess("HandleDownloadAsync try block started");
                Progress<DownloadOperation> progressCallback = new Progress<DownloadOperation>(DownloadProgress);
                //JustTestWriteSuccess("HandleDownloadAsync was called");
                if (start)
                {
                    await download.StartAsync().AsTask(progressCallback);
                }
                else
                {
                    await download.AttachAsync().AsTask(progressCallback);
                }

            }
            catch (Exception ex)
            {
                JustTestWriteSuccess("Error Generated in HandleDownloadAsync");
                Debug.WriteLine(ex.ToString());
                UpdateTaskCompleted();
            }
        }
    }

    
}
