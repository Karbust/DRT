package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;


import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;


import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class Viagens extends AppCompatActivity {

    private static final String TAG = "Viagens";
    private ApplicationContext applicationContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_viagens);

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
