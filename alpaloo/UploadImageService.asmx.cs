using System;
using System.IO;
using System.Web;
using System.Web.Services;

namespace alpaloo
{
    // Per consentire la chiamata di questo servizio Web dallo script utilizzando ASP.NET AJAX, rimuovere il commento dalla riga seguente. 
    [System.Web.Script.Services.ScriptService]
    public class UploadImageService : WebService
    {

        [WebMethod()]
        public string UploadImage(string imageData, string name)
        {
            var appath = HttpContext.Current.Request.ApplicationPath;
            string contentPath = Server.MapPath(Path.Combine(appath ,"ImgTmp"));
            if (!Directory.Exists(contentPath))
            {
                Directory.CreateDirectory(contentPath);
            }

            string fileNameWitPath = Path.Combine(contentPath , name + DateTime.Now.Ticks + ".gif");

            using (FileStream fs = new FileStream(fileNameWitPath, FileMode.Create))
            {
                using (BinaryWriter bw = new BinaryWriter(fs))
                {
                    byte[] data = Convert.FromBase64String(imageData);
                    bw.Write(data);
                    bw.Close();
                }
            }
            var di = new DirectoryInfo(fileNameWitPath);

            return Path.Combine(appath, di.Parent.Name, di.Name);
        }
    }
}
