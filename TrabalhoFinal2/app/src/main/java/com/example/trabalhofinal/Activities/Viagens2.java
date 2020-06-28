package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Responses.LoginResponse;
import com.example.trabalhofinal.Models.Responses.ViagensResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import org.w3c.dom.Text;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Viagens2 extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "Viagens2:";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    //private boolean loading=false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_viagens2);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        TextView de = findViewById(R.id.textView43);
        TextView para = findViewById(R.id.textView44);
        de.setText(applicationContext.getViagens().get(0).getOrigem().getLOCALIDADE());
        para.setText(applicationContext.getViagens().get(0).getDestino().getLOCALIDADE());

        findViewById(R.id.viagem2).setOnClickListener(this);
        findViewById(R.id.viagem4).setOnClickListener(this);
    }

    /*
    @Override
    protected void onStart() {
        super.onStart();
        if(applicationContext.getViagens()==null){
            fetchviagens();
        }else{
            TextView de = findViewById(R.id.textView43);
            TextView para = findViewById(R.id.textView44);
            de.setText(applicationContext.getViagens().get(0).getOrigem().getLOCALIDADE());
            para.setText(applicationContext.getViagens().get(0).getDestino().getLOCALIDADE());
        }
    }


    public void showProgressBar(){

        findViewById(R.id.textView47).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView45).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView28).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView41).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView43).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView30).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView42).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView44).setVisibility(View.INVISIBLE);
        findViewById(R.id.viagem2).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView53).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView54).setVisibility(View.INVISIBLE);
        findViewById(R.id.textView35).setVisibility(View.GONE);
        findViewById(R.id.textView60).setVisibility(View.GONE);
        findViewById(R.id.textView62).setVisibility(View.GONE);
        findViewById(R.id.textView37).setVisibility(View.GONE);
        findViewById(R.id.textView63).setVisibility(View.GONE);
        findViewById(R.id.textView64).setVisibility(View.GONE);
        findViewById(R.id.viagem4).setVisibility(View.GONE);
    }
*/

    public void fetchviagens() {
       // showProgressBar();
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



    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.viagem2:
            case R.id.viagem4:
                startActivity(new Intent(Viagens2.this,Viagens.class));
                break;
        }
    }
}