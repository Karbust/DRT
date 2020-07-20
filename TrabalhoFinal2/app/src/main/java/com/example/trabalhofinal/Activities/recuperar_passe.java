package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Responses.LoginResponse;
import com.example.trabalhofinal.Models.Responses.RecuperarResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.SharedPrefManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class recuperar_passe extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "recuperar_passe";

    EditText mail;
    EditText username;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recuperar_passe);

        mail = findViewById(R.id.email_recuperar);
        username = findViewById(R.id.nome_recuperar);
        
        findViewById(R.id.recuperar_button).setOnClickListener(this);
    }
    
    public void password_reset(){


        String email = mail.getText().toString().trim();
        String user = username.getText().toString().trim();

        if (user.isEmpty()) {
            username.setError("User is required");
            username.requestFocus();
            return;
        }

        if (email.isEmpty()) {
            mail.setError("Email is required");
            mail.requestFocus();
            return;
        }

        Call<RecuperarResponse> call = RetrofitClient.getInstance().getApi().reset(email,user);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<RecuperarResponse>() {

            @Override
            public void onResponse(Call<RecuperarResponse> call, Response<RecuperarResponse> response) {
                RecuperarResponse recuperarResponse = response.body();

                Log.i(TAG, "Request body" + response);
                Log.i(TAG, "Request body" + response.body().toString());
                if (recuperarResponse != null && recuperarResponse.isSuccess()) {
                    Toast.makeText(getApplicationContext(), recuperarResponse.getMessage() , Toast.LENGTH_LONG).show();
                    Intent intent = new Intent(recuperar_passe.this,MainActivity.class);
                    startActivity(intent);
                } else {
                    Toast.makeText(getApplicationContext(), recuperarResponse.getMessage() , Toast.LENGTH_LONG).show();
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
            case R.id.recuperar_button:
                password_reset();
                break;
        }
    }
}