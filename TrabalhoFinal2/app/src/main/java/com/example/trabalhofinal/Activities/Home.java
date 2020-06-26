package com.example.trabalhofinal.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Nationality;
import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.Models.Responses.NationalityResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Home extends AppCompatActivity implements View.OnClickListener {


    private static final String TAG = "HomeActivity";
    private ApplicationContext applicationContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        findViewById(R.id.button2).setOnClickListener(this);
        findViewById(R.id.terminar).setOnClickListener(this);
        findViewById(R.id.perfil).setOnClickListener(this);

        applicationContext = (ApplicationContext) getApplicationContext();
        fetchLocations();
        fetchNationalities();
    }


    private void fetchLocations() {
        if (applicationContext.getLocations() == null) {
            Call<LocationsResponse> call = RetrofitClient.getInstance().getApi().locations();

            call.enqueue(new Callback<LocationsResponse>() {
                @Override
                public void onResponse(Call<LocationsResponse> call, Response<LocationsResponse> response) {
                    LocationsResponse locationsResponse = response.body();

                    if (locationsResponse != null && locationsResponse.isSuccess()) {
                        Log.i(TAG, "Request success");
                        applicationContext.setLocations(locationsResponse.getLocations());
                    } else {
                        Log.i(TAG, "Request Failed");
                    }
                }

                @Override
                public void onFailure(Call<LocationsResponse> call, Throwable t) {
                    Log.i(TAG, "Request onFailure" + t);
                }
            });
        }
    }

    private void fetchNationalities() {
        if (applicationContext.getNationalities() == null) {
            Call<NationalityResponse> call = RetrofitClient.getInstance().getApi().nationalities();

            call.enqueue(new Callback<NationalityResponse>() {
                @Override
                public void onResponse(Call<NationalityResponse> call, Response<NationalityResponse> response) {
                    NationalityResponse nationalityResponse = response.body();

                    if (nationalityResponse != null && nationalityResponse.isSuccess()) {
                        Log.i(TAG, "Request success");
                        applicationContext.setNationalities((ArrayList<Nationality>) nationalityResponse.getNationalities());
                    } else {
                        Log.i(TAG, "Request Failed");
                    }
                }

                @Override
                public void onFailure(Call<NationalityResponse> call, Throwable t) {
                    Log.i(TAG, "Request onFailure" + t);
                }
            });
        }
    }

    @Override
    protected void onStart(){
        super.onStart();

        if(!SharedPrefManager.getInstance(this).isLoggedIn()){
            Intent intent= new Intent(Home.this,MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.terminar:
                SharedPrefManager.getInstance(Home.this).clearSession();
                Intent intent= new Intent(Home.this,MainActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                break;
            case R.id.button2:
                startActivity(new Intent(Home.this,Viagens.class));
                break;
            case R.id.perfil:
                startActivity(new Intent(Home.this,Perfil.class));
                break;
        }
    }
}
