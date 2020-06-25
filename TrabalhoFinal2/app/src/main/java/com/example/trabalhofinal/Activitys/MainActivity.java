package com.example.trabalhofinal.Activitys;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.LoginResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.SharedPrefManager;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements View.OnClickListener{

    private static final String TAG = "MainActivity";
    private static final int ERROR_DIALOG_REQUEST = 9001;
    private EditText username;
    private EditText password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        username=findViewById(R.id.Utilizador);
        password=findViewById(R.id.passe);

        findViewById(R.id.button).setOnClickListener(this);
        findViewById(R.id.textView2).setOnClickListener(this);
    }

    @Override
    protected void onStart(){
        super.onStart();

        if(SharedPrefManager.getInstance(this).isLoggedIn()){
            Intent intent= new Intent(MainActivity.this,Home.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        }
    }

    private void userLogin(){
        String user = username.getText().toString().trim();
        String passe =password.getText().toString().trim();

        if(user.isEmpty()){
            username.setError("User is required");
            username.requestFocus();
            return;
        }

        if(passe.isEmpty()){
            password.setError("Password is required");
            password.requestFocus();
            return;
        }

        Call<LoginResponse> call = RetrofitClient.getInstance().getApi().login(user,passe);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                LoginResponse loginResponse=response.body();

                Log.i(TAG, "Request body"+response);
                Log.i(TAG, "Request body"+response.body());

                if(loginResponse != null && loginResponse.isSuccess()){
                    SharedPrefManager.getInstance(MainActivity.this).saveToken(loginResponse.getToken());
                    String token=SharedPrefManager.getInstance(MainActivity.this).getToken();
                    Intent intent=new Intent(MainActivity.this,Home.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    Log.i(TAG, "Request Succefull"+token);
                    Toast.makeText(getApplicationContext(),loginResponse.getMessage(),Toast.LENGTH_LONG).show();
                    Log.i(TAG, "Request Succefull");
                }else{

                    Toast.makeText(getApplicationContext(),loginResponse.getMessage(),Toast.LENGTH_LONG).show();
                    Log.i(TAG, "Request Failed");
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure"+t);
            }
        });
    }

    @Override
    public void onClick(View v){
        switch(v.getId()){
            case R.id.button:
                userLogin();
                break;
        }
    }
}
