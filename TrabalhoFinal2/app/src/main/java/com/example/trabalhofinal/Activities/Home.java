package com.example.trabalhofinal.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Location;
import com.example.trabalhofinal.Models.Domain.Nationality;
import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.Models.Responses.NationalityResponse;
import com.example.trabalhofinal.Models.Responses.ViagensResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.R.layout.simple_spinner_dropdown_item;

public class Home extends AppCompatActivity implements View.OnClickListener {


    private static final String TAG = "HomeActivity";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        findViewById(R.id.button2).setOnClickListener(this);
        findViewById(R.id.terminar).setOnClickListener(this);
        findViewById(R.id.perfil).setOnClickListener(this);
        TextView name=findViewById(R.id.Nome);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);
        fetchLocations();
        fetchNationalities();
        fetchviagens();


        name.setText(sharedPrefManager.getNome());
    }

    private void fetchviagens() {

        int user=sharedPrefManager.getUser();
        String key=sharedPrefManager.getToken();

        Call<ViagensResponse> call = RetrofitClient.getInstance().getApi().viagens(user,key);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<ViagensResponse>() {

            @Override
            public void onResponse(Call<ViagensResponse> call, Response<ViagensResponse> response) {
                ViagensResponse viagensResponse = response.body();
                if (viagensResponse != null && viagensResponse.isSuccess()) {

                    applicationContext.setViagens(viagensResponse.getViagens());
                    Log.i(TAG, "Request Successful" );

                } else {


                    Log.i(TAG, "Request Failed");

                }
            }

            @Override
            public void onFailure(Call<ViagensResponse> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure" + t);
            }
        });
    }


    private void fetchLocations() {
        List<Location> locations = applicationContext.getLocations();
        if (locations == null) {
            Call<LocationsResponse> call = RetrofitClient.getInstance().getApi().locations();

            call.enqueue(new Callback<LocationsResponse>() {
                @Override
                public void onResponse(Call<LocationsResponse> call, Response<LocationsResponse> response) {
                    LocationsResponse locationsResponse = response.body();

                    if (locationsResponse != null && locationsResponse.isSuccess()) {

                        Log.i(TAG, "Request success");

                        applicationContext.setLocations(locationsResponse.getLocations());

                        Log.i(TAG,"onResponse:"+locationsResponse.getLocations());


                    } else {
                        Log.i(TAG, "Request Failed");
                    }
                }

                @Override
                public void onFailure(Call<LocationsResponse> call, Throwable t) {
                    Log.i(TAG, "Request onFailure" + t);
                }
            });
        }else{

        }
    }

    private void fetchNationalities() {
        List<Nationality> nationalities = applicationContext.getNationalities();
        if (nationalities == null) {
            Call<NationalityResponse> call = RetrofitClient.getInstance().getApi().nationalities();

            call.enqueue(new Callback<NationalityResponse>() {
                @Override
                public void onResponse(Call<NationalityResponse> call, Response<NationalityResponse> response) {
                    NationalityResponse nationalityResponse = response.body();

                    if (nationalityResponse != null && nationalityResponse.isSuccess()) {

                        Log.i(TAG, "Request success");

                        applicationContext.setNationalities(nationalityResponse.getNationalities());

                        Log.i(TAG,"onResponse:"+nationalityResponse.getNationalities());
                        List<String> nacionalidades = nationalityResponse.getNationalities().stream().map(nationality1 -> nationality1.getNOME()).collect(Collectors.toList());

                    } else {
                        Log.i(TAG, "Request Failed");
                    }
                }

                @Override
                public void onFailure(Call<NationalityResponse> call, Throwable t) {
                    Log.i(TAG, "Request onFailure" + t);
                }
            });
        }else{
            List<String> nacionalidades = nationalities.stream().map(nationality1 -> nationality1.getNOME()).collect(Collectors.toList());

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
                startActivity(new Intent(Home.this,Viagens2.class));
                break;
            case R.id.perfil:
                startActivity(new Intent(Home.this,Perfil.class));
                break;
        }
    }
}
