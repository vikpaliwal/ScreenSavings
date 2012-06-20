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
using Windows.Networking.BackgroundTransfer;
using Windows.System.UserProfile;

namespace BackgroundTask
{
    public sealed class ScreenSavingsTask : IBackgroundTask
    {
        private string tileUpdateURL = "http://198.101.207.173/iss/WINDOWS_TILES.PHP";
        private string lockScreenImageURL = "http://198.101.207.173/iss/tile.bmp";
        private string lockScreenImageName = "screen-savings.bmp";

        BackgroundTaskDeferral deferral = null;
        private int taskCompleted;
        private Object lockTaskCompleted = new Object();
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

        private async void DownloadLockScreenImageAsync()
        {
            try
            {
                Uri source = new Uri(lockScreenImageURL);

                lockScreenImageFile = await ApplicationData.Current.LocalFolder.CreateFileAsync(
                    lockScreenImageName, CreationCollisionOption.ReplaceExisting);

                BackgroundDownloader downloader = new BackgroundDownloader();
                DownloadOperation download = downloader.CreateDownload(source, lockScreenImageFile);

                await HandleDownloadAsync(download, true);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                UpdateTaskCompleted();
            }
        }

        private async void DownloadProgress(DownloadOperation download)
        {
            Debug.WriteLine(String.Format("Progress: {0}, Bytes: {1}, Status: {2}", download.Guid, download.Progress.BytesReceived,
                                    download.Progress.Status));

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
                Progress<DownloadOperation> progressCallback = new Progress<DownloadOperation>(DownloadProgress);
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
                Debug.WriteLine(ex.ToString());
                UpdateTaskCompleted();
            }
        }
    }
}
