package com.example.trabalhofinal.Activities;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.MimeTypeMap;

import org.apache.commons.io.FileUtils;
import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.Utils.RetrofitUtils;
import com.example.trabalhofinal.storage.ApplicationContext;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Registo extends AppCompatActivity implements View.OnClickListener {

    private static final int REQUEST_CODE_CARTAO_DE_CIDADAO = 100;
    private static final int REQUEST_CODE_COMPROVATIVO_DE_MORADA = 101;
    private static final String TAG = "Registo";
    private ArrayList<Uri> listUri = new ArrayList<>();
    private ApplicationContext applicationContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registo);
        applicationContext = (ApplicationContext) getApplicationContext();

        findViewById(R.id.imageView).setOnClickListener(this);
        findViewById(R.id.select_cc_image).setOnClickListener(this);
        findViewById(R.id.select_cm_image).setOnClickListener(this);
    }

    @Override
    public void onClick(View v){
        switch(v.getId()){
            case R.id.imageView:
                regist();
                break;
            case R.id.select_cc_image:
                triggerSelectImagesIntent(true);
                break;
            case R.id.select_cm_image:
                triggerSelectImagesIntent(false);
                break;
        }
    }

    private void triggerSelectImagesIntent(boolean isCartaoDeCidadao) {
        Intent getIntent = new Intent(Intent.ACTION_GET_CONTENT);
        getIntent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        getIntent.setType("image/*");
        Intent pickIntent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        pickIntent.setType("image/*");
        Intent chooserIntent = Intent.createChooser(getIntent, "Select Image");
        chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[] {pickIntent});
        if (isCartaoDeCidadao) {
            startActivityForResult(chooserIntent, REQUEST_CODE_CARTAO_DE_CIDADAO);
        } else {
            startActivityForResult(chooserIntent, REQUEST_CODE_COMPROVATIVO_DE_MORADA);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == REQUEST_CODE_CARTAO_DE_CIDADAO) {
            if(resultCode == Activity.RESULT_OK) {
                if(data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    int currentItem = 0;
                    while (currentItem < count) {
                        Uri imageUri = data.getClipData().getItemAt(currentItem).getUri();
                        listUri.add(imageUri);
                        currentItem++;
                    }
                }
            }
        } else if (requestCode == REQUEST_CODE_COMPROVATIVO_DE_MORADA) {
            if(resultCode == Activity.RESULT_OK) {
                if(data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    int currentItem = 0;
                    while (currentItem < count) {
                        Uri imageUri = data.getClipData().getItemAt(currentItem).getUri();
                        listUri.add(imageUri);
                        currentItem++;
                    }
                }
            }
        }
    }

    private void regist() {
        HashMap<String, RequestBody> map = new HashMap<>();

        map.put("nome", RetrofitUtils.createPartFromString("boda"));
        map.put("datanascimento", RetrofitUtils.createPartFromString("2012-12-12"));
        map.put("genero", RetrofitUtils.createPartFromString("M"));
        map.put("ncc", RetrofitUtils.createPartFromString("1"));
        map.put("nss", RetrofitUtils.createPartFromString("123"));
        map.put("nif", RetrofitUtils.createPartFromString("123"));
        map.put("telemovel", RetrofitUtils.createPartFromString("123"));
        map.put("telefone", RetrofitUtils.createPartFromString("123"));
        map.put("nacionalidade", RetrofitUtils.createPartFromString("189"));
        map.put("morada", RetrofitUtils.createPartFromString("esquina"));
        map.put("codpostal", RetrofitUtils.createPartFromString("2100-100"));
        map.put("localidade", RetrofitUtils.createPartFromString("boda"));
        map.put("email", RetrofitUtils.createPartFromString("boda@gmail.com"));
        map.put("utilizador", RetrofitUtils.createPartFromString("ola"));
        map.put("password", RetrofitUtils.createPartFromString("adeus"));

        List<MultipartBody.Part> parts = new ArrayList<>();
        for (Uri uri : listUri) {
            Log.i(TAG, "getPathSegments: " + uri.getPathSegments());
        }

        parts.add(RetrofitUtils.prepareFilePart(applicationContext, listUri.get(0), "cartao_cidadao"));
        parts.add(RetrofitUtils.prepareFilePart(applicationContext, listUri.get(1), "comprovativo_morada"));

        Log.i(TAG, "data: " + map);
        Log.i(TAG, "files: " + parts);

        Call<ResponseBody> call = RetrofitClient.getInstance().getApi().regist(map, parts);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.body() != null && response.isSuccessful()) {
                    Log.i(TAG, "Request success: " + response.body());
                } else {
                    Log.i(TAG, "Request Failed");
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i(TAG, "Request onFailure" + t);
            }
        });
    }

//    private int uploadPhoto(File file) {
//        int returnValue;
//
//        MultipartBody.Part filePart = MultipartBody.Part.createFormData(
//                "file",
//                file.getName(),
//                RequestBody.create(MediaType.parse("image/*"), file)
//        );
//
//        ServerService service = RetrofitClientInstance.getRetrofitInstance();
//        Call<Void> call = service.uploadDishPhoto(selectedCampus, foodServiceName, dishName, filePart);
//        try {
//            Response response = call.execute();
//            if (response.isSuccessful()) {
//                returnValue = IUploadPhotoRequester.SUCCESS;
//
//                globalContext.setCanFetchMoreDishPhotosIds(
//                        Utils.getKeyFromNames(selectedCampus, foodServiceName, dishName),
//                        true
//                );
//            } else {
//                switch (response.code()) {
//                    case 509:
//                        returnValue = IUploadPhotoRequester.SIZE_EXCEEDED;
//                        break;
//                    default:
//                        returnValue = IUploadPhotoRequester.ERROR;
//                        break;
//                }
//            }
//        } catch (Exception e) {
//            returnValue = IUploadPhotoRequester.ERROR;
//        }
//        return returnValue;
//    }

}