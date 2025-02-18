package com.example.trabalhofinal.Activities;

import android.content.Intent;
import android.nfc.Tag;
import android.os.Bundle;
import android.text.method.PasswordTransformationMethod;
import android.text.method.TransformationMethod;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.User;
import com.example.trabalhofinal.Models.Responses.LoginResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements View.OnClickListener{

    private static final String TAG = "MainActivity";
    private static final int ERROR_DIALOG_REQUEST = 9001;
    private EditText username;
    private EditText password;
    private CheckBox checkBox;
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        username=findViewById(R.id.Utilizador);
        password=findViewById(R.id.passe);
        checkBox = findViewById(R.id.checkBox);

        findViewById(R.id.iniciar_sessao).setOnClickListener(this);
        findViewById(R.id.registe_se_aqui).setOnClickListener(this);
        findViewById(R.id.esqueceu_palavra_passe).setOnClickListener(this);
        checkBox.setOnClickListener(this);
    }

    @Override
    protected void onStart(){
        super.onStart();

        if(SharedPrefManager.getInstance(this).isLoggedIn() && SharedPrefManager.getInstance(this).getTipoutilizador() == 5){
            Intent intent= new Intent(MainActivity.this,Home_Motorista.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        }else if(SharedPrefManager.getInstance(this).isLoggedIn() && SharedPrefManager.getInstance(this).getTipoutilizador() == 7){
            Intent intent= new Intent(MainActivity.this,Home.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        }
    }

    private void userLogin() {
        String user = username.getText().toString().trim();
        String passe = password.getText().toString().trim();

        if (user.isEmpty()) {
            username.setError("User is required");
            username.requestFocus();
            return;
        }

        if (passe.isEmpty()) {
            password.setError("Password is required");
            password.requestFocus();
            return;
        }

        Call<LoginResponse> call = RetrofitClient.getInstance().getApi().login(user, passe,true);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<LoginResponse>() {

            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                LoginResponse loginResponse = response.body();

                Log.i(TAG, "Request body" + response);
                //Log.i(TAG, "Request body" + response.body().toString());

                if (loginResponse != null && loginResponse.isSuccess()) {

                    SharedPrefManager.getInstance(applicationContext).saveSession(loginResponse.getToken(),loginResponse.getUser());
                    String token = SharedPrefManager.getInstance(applicationContext).getToken();
                    if(loginResponse.getUser().getTipo() == 5){
                        Intent intent = new Intent(MainActivity.this, Home_Motorista.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                    }else if(loginResponse.getUser().getTipo() == 7){
                        Intent intent = new Intent(MainActivity.this, Home.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                    }
                    Log.i(TAG, "Request Successful" + token);
                    Toast.makeText(getApplicationContext(), loginResponse.getMessage(), Toast.LENGTH_LONG).show();

                } else {

                   Toast.makeText(getApplicationContext(), loginResponse.getMessage(), Toast.LENGTH_LONG).show();
                    Log.i(TAG, "Request Failed");

                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure" + t);
            }
        });
    }

    @Override
    public void onClick(View v){
        switch(v.getId()){
            case R.id.iniciar_sessao:
                userLogin();
                break;
            case R.id.registe_se_aqui:
                startActivity(new Intent(MainActivity.this, Registo.class));
                break;
            case R.id.esqueceu_palavra_passe:
                startActivity(new Intent(MainActivity.this, recuperar_passe.class));
                break;
            case R.id.checkBox:
                if(checkBox.isChecked()){
                    password.setTransformationMethod(null);
                }else{
                    password.setTransformationMethod(new PasswordTransformationMethod());
                }
                break;
        }
    }
}