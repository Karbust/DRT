package com.example.trabalhofinal.Utils;

import android.net.Uri;
import android.util.Log;
import android.webkit.MimeTypeMap;

import com.example.trabalhofinal.storage.ApplicationContext;

import java.io.File;
import java.io.InputStream;

public class FileUtils {
    private static final String TAG = "FileUtils";

    public static File convertUriToFileOnInternalMemory(ApplicationContext applicationContext, Uri uri, String filename) {
        try {
            File storageDir = applicationContext.getFilesDir();
            Log.i(TAG, "storageDir: " + storageDir);

            MimeTypeMap mime = MimeTypeMap.getSingleton();
            String extension = mime.getExtensionFromMimeType(applicationContext.getContentResolver().getType(uri));
            File file = new File(storageDir, filename + "." + extension);

            InputStream in =  applicationContext.getContentResolver().openInputStream(uri);
            org.apache.commons.io.FileUtils.copyInputStreamToFile(in, file);
            return file;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
