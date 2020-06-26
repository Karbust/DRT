package com.example.trabalhofinal.Activitys;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import com.example.trabalhofinal.R;

import java.io.File;

import io.opencensus.internal.Utils;
import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.Response;

public class Registo extends AppCompatActivity implements View.OnClickListener {

    private static final int REQUEST_CODE_IMAGE_PICKER = 100;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registo);

        findViewById(R.id.imageView).setOnClickListener(this);
    }

    
    @Override
    public void onClick(View v) {

    }

    private int uploadPhoto(File file) {
        int returnValue;

        MultipartBody.Part filePart = MultipartBody.Part.createFormData(
                "file",
                file.getName(),
                RequestBody.create(MediaType.parse("image/*"), file)
        );

        ServerService service = RetrofitClientInstance.getRetrofitInstance();
        Call<Void> call = service.uploadDishPhoto(selectedCampus, foodServiceName, dishName, filePart);
        try {
            Response response = call.execute();
            if (response.isSuccessful()) {
                returnValue = IUploadPhotoRequester.SUCCESS;

                globalContext.setCanFetchMoreDishPhotosIds(
                        Utils.getKeyFromNames(selectedCampus, foodServiceName, dishName),
                        true
                );
            } else {
                switch (response.code()) {
                    case 509:
                        returnValue = IUploadPhotoRequester.SIZE_EXCEEDED;
                        break;
                    default:
                        returnValue = IUploadPhotoRequester.ERROR;
                        break;
                }
            }
        } catch (Exception e) {
            returnValue = IUploadPhotoRequester.ERROR;
        }
        return returnValue;
    }

}