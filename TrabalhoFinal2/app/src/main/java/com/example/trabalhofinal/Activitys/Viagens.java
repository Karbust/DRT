package com.example.trabalhofinal.Activitys;

import androidx.appcompat.app.AppCompatActivity;


import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.LocationsResponse;
import com.example.trabalhofinal.Models.LoginResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.net.URI;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class Viagens extends AppCompatActivity {

    private static final String TAG = "Viagens";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_viagens);
        getLocations();
    }

    private void getLocations(){


        Call<LocationsResponse> call = RetrofitClient.getInstance().getApi().locations();
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<LocationsResponse>() {
            @Override
            public void onResponse(Call<LocationsResponse> call, Response<LocationsResponse> response) {
                LocationsResponse locationsResponse=response.body();

                Log.i(TAG, "Request body"+response);
                Log.i(TAG, "Request body"+response.body());

                if(locationsResponse != null && locationsResponse.isSuccess()){

                    for(LocationsResponse.Data location : locationsResponse.getData()) {
                        Log.i(TAG, "Request Succefull"+location);
                    }
                }else{

                    Log.i(TAG, "Request Failed");
                }
            }

            @Override
            public void onFailure(Call<LocationsResponse> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure"+t);
            }
        });
    }

    public void process(View view)
    {
        Intent intent=null , chooser=null;

        if(view.getId()==R.id.viagem)
        {
            String latitude=String.valueOf("40.650006");
            String longitude=String.valueOf("-7.919807");
            Uri gmmIntentUri=Uri.parse("google.navigation:q="+latitude+","+longitude);
            Intent mapIntent= new Intent(Intent.ACTION_VIEW,gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            startActivity(mapIntent);
        }
    }
}
