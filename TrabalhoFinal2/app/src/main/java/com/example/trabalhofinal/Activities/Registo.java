package com.example.trabalhofinal.Activities;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Location;
import com.example.trabalhofinal.Models.Domain.Nationality;
import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.Models.Responses.NationalityResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.Utils.RetrofitUtils;
import com.example.trabalhofinal.storage.ApplicationContext;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.R.layout.simple_spinner_dropdown_item;

public class Registo extends AppCompatActivity implements View.OnClickListener, AdapterView.OnItemSelectedListener {

    private static final int REQUEST_CODE_CARTAO_DE_CIDADAO = 100;
    private static final int REQUEST_CODE_COMPROVATIVO_DE_MORADA = 101;
    private static final String TAG = "Registo";
    private ArrayList<Uri> listUri = new ArrayList<>();
    private ApplicationContext applicationContext;

    private EditText nome;
    private EditText ncc;
    private EditText nss;
    private EditText morada;
    private EditText telemovel;
    private EditText nif;
    private EditText email;
    private EditText password;
    private TextView mdatanascimento;
    private Spinner spinner;
    private EditText postal;
    private EditText utilizador;
    private DatePickerDialog.OnDateSetListener onDateSetListener;
    private String date;
    private EditText telefone;
    private String genero;
    private static final String[] paths = {"Masculino","Feminino","Outro"};
    private EditText localidade;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registo);

        nome=findViewById(R.id.nome);
        ncc=findViewById(R.id.cc);
        nss=findViewById(R.id.niss);
        morada=findViewById(R.id.morada);
        telemovel=findViewById(R.id.telemovel);
        nif=findViewById(R.id.nif);
        email=findViewById(R.id.email);
        password=findViewById(R.id.pass);
        mdatanascimento=findViewById(R.id.datanasc);
        utilizador=findViewById(R.id.utilizador);
        postal=findViewById(R.id.postal);
        telefone=findViewById(R.id.telefone);
        localidade=findViewById(R.id.localidade);

        spinner =findViewById(R.id.spinner);



        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, simple_spinner_dropdown_item, paths);
        //set the spinners adapter to the previously created one.
        spinner.setAdapter(adapter);
        spinner.setOnItemSelectedListener(this);



        applicationContext = (ApplicationContext) getApplicationContext();



        findViewById(R.id.select_cc_image).setOnClickListener(this);
        findViewById(R.id.select_cm_image).setOnClickListener(this);
        findViewById(R.id.datanasc).setOnClickListener(this);
    }


    private void regist() {
        Log.i(TAG,"Passei aqui:");
        HashMap<String, RequestBody> map = new HashMap<>();

        String user_name = nome.getText().toString().trim();
        String birth = mdatanascimento.getText().toString().trim();
        String cartao_cidado=ncc.getText().toString().trim();
        String seguranca_social=nss.getText().toString().trim();
        String NIF=nif.getText().toString().trim();
        String tele=telemovel.getText().toString().trim();
        String address=morada.getText().toString().trim();
        String mail=email.getText().toString().trim();
        String user=utilizador.getText().toString().trim();
        String passe=password.getText().toString().trim();
        String codigo_postal=postal.getText().toString().trim();
        String phone=telefone.getText().toString().trim();
        String location=localidade.getText().toString().trim();


        if(user_name.isEmpty()){
            nome.setError("Em falta!");
            nome.requestFocus();
            return;
        }

        if(cartao_cidado.isEmpty()){
            ncc.setError("Em falta!");
            ncc.requestFocus();
            return;
        }

        if(seguranca_social.isEmpty()){
            nss.setError("Em falta!");
            nss.requestFocus();
            return;
        }

        if(NIF.isEmpty()){
            nif.setError("Em falta!");
            nif.requestFocus();
            return;
        }

        if(address.isEmpty()){
            morada.setError("Em falta!");
            morada.requestFocus();
            return;
        }

        if(mail.isEmpty()){
            email.setError("Em falta!");
            email.requestFocus();
            return;
        }

        if(user.isEmpty()){
            utilizador.setError("Em falta!");
            utilizador.requestFocus();
            return;
        }

        if(passe.isEmpty()){
            password.setError("Em falta!");
            password.requestFocus();
            return;
        }

        if(phone.isEmpty()){
            telefone.setError("Em falta!");
            telefone.requestFocus();
            return;
        }


        if(birth.isEmpty()){
            mdatanascimento.setError("Em falta!");
            mdatanascimento.requestFocus();
            return;
        }



        map.put("nome", RetrofitUtils.createPartFromString(user_name));
        map.put("datanascimento", RetrofitUtils.createPartFromString(date));
        map.put("genero", RetrofitUtils.createPartFromString(genero));
        map.put("ncc", RetrofitUtils.createPartFromString(cartao_cidado));
        map.put("nss", RetrofitUtils.createPartFromString(seguranca_social));
        map.put("nif", RetrofitUtils.createPartFromString(NIF));
        map.put("telemovel", RetrofitUtils.createPartFromString(tele));
        map.put("telefone", RetrofitUtils.createPartFromString(phone));
        map.put("nacionalidade", RetrofitUtils.createPartFromString("189"));
        map.put("morada", RetrofitUtils.createPartFromString(address));
        map.put("codpostal", RetrofitUtils.createPartFromString(codigo_postal));
        map.put("localidade", RetrofitUtils.createPartFromString(location));
        map.put("email", RetrofitUtils.createPartFromString(mail));
        map.put("utilizador", RetrofitUtils.createPartFromString(user));
        map.put("password", RetrofitUtils.createPartFromString(passe));

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


    public void Data(){
        Calendar cal= Calendar.getInstance();
        int ano = cal.get(Calendar.YEAR);
        int mes = cal.get(Calendar.MONTH);
        int dia = cal.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog dialog = new DatePickerDialog(Registo.this,android.R.style.Theme_Holo_Light_Dialog_MinWidth,onDateSetListener,ano,mes,dia);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.show();


        onDateSetListener=new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
                month=month+1;
                if(month < 10) {
                    Log.d(TAG, "onDateSet:date: " + year + "-" + month + "-" + dayOfMonth);
                    date = year + "-0" + month + "-" + dayOfMonth;
                    mdatanascimento.setText(date);
                }else{
                    Log.d(TAG, "onDateSet:date: " + year + "-" + month + "-" + dayOfMonth);
                    date = year + "-" + month + "-" + dayOfMonth;
                    mdatanascimento.setText(date);
                }
            }
        };
    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        Log.i(TAG,"Passei item selected");
        switch (position){
            case 0:
                genero="M";
                break;
            case 1:
                genero="F";
                break;
            case 2:
                genero="O";
                break;
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {
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
                }else if(data.getData() != null){
                    Uri imageUri = data.getData();
                    listUri.add(imageUri);
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
                }else if(data.getData() != null){
                    Uri imageUri = data.getData();
                    listUri.add(imageUri);
                }
            }
        }
    }


    @Override
    public void onClick(View v){
        switch(v.getId()){
            //case R.id.imageView:
              //  Log.i(TAG,"Passei em regist");
                //regist();
                //break;
            case R.id.select_cc_image:
                triggerSelectImagesIntent(true);
                break;
            case R.id.select_cm_image:
                triggerSelectImagesIntent(false);
                break;
            case R.id.datanasc:
              Data();
               break;
        }
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