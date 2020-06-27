package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.TextView;

import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

public class Perfil extends AppCompatActivity  {

    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_perfil);
        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        TextView nome=findViewById(R.id.textView21);
        TextView email=findViewById(R.id.textView25);
        TextView telemovel=findViewById(R.id.textView26);



        nome.setText(sharedPrefManager.getNome());
        email.setText(sharedPrefManager.getEmail());
        //telemovel.setText(sharedPrefManager.getTelemovel(),toString());
    }
}
