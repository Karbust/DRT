package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Responses.RecuperarResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class defenicoes extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "defenicoes";

    EditText password_antiga;
    EditText password_nova;
    EditText password_nova_confirmacao;

    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_defenicoes);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        password_antiga = findViewById(R.id.editTextTextPassword);
        password_nova = findViewById(R.id.editTextTextPersonName);
        password_nova_confirmacao = findViewById(R.id.editTextTextPersonName2);

        findViewById(R.id.button).setOnClickListener(this);
    }

    public void alterarpassword(){
        String pass_antiga = password_antiga.getText().toString().trim();
        String pass_nova = password_nova.getText().toString().trim();
        String pass_nova_confirmacao = password_nova_confirmacao.getText().toString().trim();
        String key = sharedPrefManager.getToken();

        if(pass_antiga.isEmpty()){
            password_antiga.setError("Em falta!");
            password_antiga.requestFocus();
            return;
        }

        if(pass_nova.isEmpty()){
            password_nova.setError("Em falta!");
            password_nova.requestFocus();
            return;
        }

        if(pass_nova_confirmacao.isEmpty()){
            password_nova_confirmacao.setError("Em falta!");
            password_nova_confirmacao.requestFocus();
            return;
        }

        if(!pass_nova.equals(pass_nova_confirmacao)){
            password_nova_confirmacao.setError("Password nova e confirmçao tem que ser iguais!");
            password_nova_confirmacao.requestFocus();
            return;
        }

        if(password_nova.equals(password_antiga)){
            password_nova.setError("Password nova e confirmçao tem que ser iguais!");
            password_nova.requestFocus();
            return;
        }

        Call<RecuperarResponse> call = RetrofitClient.getInstance().getApi().editarpass(pass_antiga,pass_nova,key);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<RecuperarResponse>() {

            @Override
            public void onResponse(Call<RecuperarResponse> call, Response<RecuperarResponse> response) {
                RecuperarResponse recuperarResponse = response.body();

                Log.i(TAG, "Request body" + response);
                if (recuperarResponse != null && recuperarResponse.isSuccess()) {
                    Toast.makeText(getApplicationContext(), recuperarResponse.getMessage() , Toast.LENGTH_LONG).show();
                    if(sharedPrefManager.getTipoutilizador() == 7){
                        Intent intent = new Intent(defenicoes.this,Perfil.class);
                        startActivity(intent);
                    }else if(sharedPrefManager.getTipoutilizador() == 5){
                        Intent intent = new Intent(defenicoes.this, Perfil_cliente.class);
                        startActivity(intent);
                    }
                } else {
                    //Toast.makeText(getApplicationContext(), recuperarResponse.getMessage() , Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<RecuperarResponse> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure" + t);
                Toast.makeText(getApplicationContext(), "Nao foi possivel comunicar com o servidor!", Toast.LENGTH_LONG).show();
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.button:
                alterarpassword();
                break;
        }
    }
}