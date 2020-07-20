package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Notificacoes;
import com.example.trabalhofinal.Models.Domain.Stats;
import com.example.trabalhofinal.Models.Responses.NotificacoesResponse;
import com.example.trabalhofinal.Models.Responses.StatsResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Home_Motorista extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "Home_Motorista";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    private TextView nome;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home__motorista);

        nome = findViewById(R.id.Nome);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        fetch_stats();
        fetch_notificacoes();

        findViewById(R.id.viagens).setOnClickListener(this);
        findViewById(R.id.marcar).setOnClickListener(this);
        findViewById(R.id.terminar).setOnClickListener(this);
        findViewById(R.id.perfil).setOnClickListener(this);

        String name = sharedPrefManager.getNome();

        nome.setText(name);
    }

    public void fetch_stats(){
        int user = sharedPrefManager.getUser();
        List<Stats> stats = applicationContext.getStats();
        String key = sharedPrefManager.getToken();

        if (stats == null) {
            Call<StatsResponse> call = RetrofitClient.getInstance().getApi().stats(user,key);

            call.enqueue(new Callback<StatsResponse>() {
                @Override
                public void onResponse(Call<StatsResponse> call, Response<StatsResponse> response) {
                    StatsResponse statsResponse = response.body();

                    if (statsResponse != null && statsResponse.isSuccess()) {

                        Log.i(TAG, "Request success");

                        applicationContext.setStats(statsResponse.getData());

                        Log.i(TAG,"onResponse:"+statsResponse.getData());


                    } else {
                        Log.i(TAG, "Request Failed");
                    }
                }

                @Override
                public void onFailure(Call<StatsResponse> call, Throwable t) {
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


    @Override
    protected void onStart(){
        super.onStart();

        if(!SharedPrefManager.getInstance(this).isLoggedIn()){
            Intent intent= new Intent(Home_Motorista.this,MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.terminar:
                SharedPrefManager.getInstance(Home_Motorista.this).clearSession();
                Intent intent= new Intent(Home_Motorista.this,MainActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                break;
            case R.id.viagens:
                startActivity(new Intent(Home_Motorista.this,ViagensMotoristaActivity.class));
                break;
            case R.id.marcar:
                startActivity(new Intent(Home_Motorista.this,Perfil.class));
                break;
            case R.id.perfil:
                startActivity(new Intent(Home_Motorista.this, HistoricoMotorista.class));
        }
    }
}