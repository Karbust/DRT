package com.example.trabalhofinal.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Location;
import com.example.trabalhofinal.Models.Domain.Notificacoes;
import com.example.trabalhofinal.Models.Domain.Stats;
import com.example.trabalhofinal.Models.Responses.DividaResponse;
import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.Models.Responses.NotificacoesResponse;
import com.example.trabalhofinal.Models.Responses.StatsResponse;
import com.example.trabalhofinal.Models.Responses.ViagensResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Home extends AppCompatActivity implements View.OnClickListener {


    private static final String TAG = "HomeActivity";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        findViewById(R.id.terminar).setOnClickListener(this);
        findViewById(R.id.perfil).setOnClickListener(this);
        findViewById(R.id.marcar).setOnClickListener(this);
        findViewById(R.id.viagens).setOnClickListener(this);
        findViewById(R.id.viagens_cliente).setOnClickListener(this);
        TextView name=findViewById(R.id.Nome);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        fetchLocations();
        fetch_notificacoes();
        fetch_divida();

        name.setText(sharedPrefManager.getNome());
    }


    public void fetch_divida(){

        int user = sharedPrefManager.getUser();
        DividaResponse dividaResponse = applicationContext.getDividaResponse();
        String key = sharedPrefManager.getToken();

        if (dividaResponse == null) {
            Call<DividaResponse> call = RetrofitClient.getInstance().getApi().divida(user,key);

            call.enqueue(new Callback<DividaResponse>() {
                @Override
                public void onResponse(Call<DividaResponse> call, Response<DividaResponse> response) {
                    DividaResponse dividaResponse1 = response.body();

                    if (dividaResponse1 != null && dividaResponse1.isSuccess()) {

                        Log.i(TAG, "Request success");

                        applicationContext.setDividaResponse(dividaResponse1);


                    } else {
                        Log.i(TAG, "Request Failed");
                    }
                }

                @Override
                public void onFailure(Call<DividaResponse> call, Throwable t) {
                    Log.i(TAG, "Request onFailure" + t);
                }
            });
        }else{

        }
    }

    public void fetch_notificacoes(){
        int user = sharedPrefManager.getUser();
        List<Notificacoes> notificacoes = applicationContext.getNotificacoes();
        String key = sharedPrefManager.getToken();

        if (notificacoes == null) {
            Call<NotificacoesResponse> call = RetrofitClient.getInstance().getApi().notifcacoes(user,key);

            call.enqueue(new Callback<NotificacoesResponse>() {
                @Override
                public void onResponse(Call<NotificacoesResponse> call, Response<NotificacoesResponse> response) {
                    NotificacoesResponse notificacoesResponse = response.body();

                    if (notificacoesResponse != null && notificacoesResponse.isSuccess()) {

                        Log.i(TAG, "Request success");

                        applicationContext.setNotificacoes(notificacoesResponse.getNotificacoes());

                        Log.i(TAG,"onResponse:"+notificacoesResponse.getNotificacoes());


                    } else {
                        Log.i(TAG, "Request Failed");
                    }
                }

                @Override
                public void onFailure(Call<NotificacoesResponse> call, Throwable t) {
                    Log.i(TAG, "Request onFailure" + t);
                }
            });
        }else{

        }
    }



    private void fetchLocations() {
        Log.i(TAG,"Passei fetch locations ");
        List<Location> locations = applicationContext.getLocations();
        String key = sharedPrefManager.getToken();
        if (locations == null) {
            Call<LocationsResponse> call = RetrofitClient.getInstance().getApi().locations(key);

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
            case R.id.perfil:
                startActivity(new Intent(Home.this,Perfil_cliente.class));
                break;
            case R.id.viagens:
                startActivity(new Intent(Home.this,Historico.class));
                break;
            case R.id.marcar:
                if(applicationContext.getDividaResponse().getData().get(0).getMontante() > 0){
                    Toast.makeText(getApplicationContext(), "Tem dividas pendentes! \n Contacte o callcenter!", Toast.LENGTH_LONG).show();
                }else{
                    startActivity(new Intent(Home.this,MarcarViagem.class));
                }
                break;
            case R.id.viagens_cliente:
                startActivity(new Intent(Home.this,Viagens2.class));
                break;
        }
    }
}