package com.example.trabalhofinal.Utils;

import android.net.Uri;
import android.util.Log;
import android.widget.EditText;

import com.example.trabalhofinal.storage.ApplicationContext;

import java.io.File;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;

public class RetrofitUtils {
    private static final String TAG = "RetrofitUtils";

    public static RequestBody createPartFromString(String string) {
        return RequestBody.create(okhttp3.MultipartBody.FORM, string);
    }

    public static MultipartBody.Part prepareFilePart(ApplicationContext applicationContext, Uri fileUri, String filename) {
        File file = FileUtils.convertUriToFileOnInternalMemory(applicationContext, fileUri, filename);
        Log.i(TAG, "file.getName(): " + file.getName());
        // create RequestBody instance from file
        RequestBody requestFile =
                RequestBody.create(
                        MediaType.parse(applicationContext.getContentResolver().getType(fileUri)),
                        file
                );

        return MultipartBody.Part.createFormData("files", file.getName(), requestFile);
    }
}
