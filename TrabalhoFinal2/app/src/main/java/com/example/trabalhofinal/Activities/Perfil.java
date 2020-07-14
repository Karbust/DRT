package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import org.w3c.dom.Text;

public class Perfil extends AppCompatActivity implements View.OnClickListener {

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
        TextView user = findViewById(R.id.textView42);
        findViewById(R.id.imageView).setOnClickListener(this);
        TextView tipo_user = findViewById(R.id.textView22);

        String aux=""+sharedPrefManager.getTelemovel();
        String aux1=""+sharedPrefManager.getUser();

        nome.setText(sharedPrefManager.getNome());
        user.setText(aux1);
        email.setText(sharedPrefManager.getEmail());
        telemovel.setText(aux);
        if(sharedPrefManager.getTipoutilizador() == 5){
            tipo_user.setText("Motorista");
        }

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.imageView:
                startActivity(new Intent(Perfil.this,Estatistica.class));
                break;
        }
    }
}
