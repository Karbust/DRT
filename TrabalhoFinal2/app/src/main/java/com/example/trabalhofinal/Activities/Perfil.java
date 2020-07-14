package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.example.trabalhofinal.Models.Domain.Notificacoes;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import org.w3c.dom.Text;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

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
        findViewById(R.id.imageView16).setOnClickListener(this);

        String aux=""+sharedPrefManager.getTelemovel();
        String aux1=""+sharedPrefManager.getUser();

        nome.setText(sharedPrefManager.getNome());
        user.setText(aux1);
        email.setText(sharedPrefManager.getEmail());
        telemovel.setText(aux);
        if(sharedPrefManager.getTipoutilizador() == 5){
            tipo_user.setText("Motorista");
        }

        ArrayList<Notificacoes> notificacoes = applicationContext.getNotificacoes();
        ArrayList<Notificacoes> notificacoes1 = (ArrayList<Notificacoes>) notificacoes.clone();

        for(Notificacoes var : notificacoes1){
            var.setCreatedAt(parseDate(var.getCreatedAt(),new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),new SimpleDateFormat("dd-MM-yyyy HH:mm")));
        }

    }

    public static String parseDate(String inputDateString, SimpleDateFormat inputDateFormat, SimpleDateFormat outputDateFormat) {
        Date date = null;
        String outputDateString = null;
        try {
            date = inputDateFormat.parse(inputDateString);
            outputDateString = outputDateFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return outputDateString;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.imageView:
                startActivity(new Intent(Perfil.this,Estatistica.class));
                break;
            case R.id.imageView16:
                startActivity(new Intent(Perfil.this,NotificacoesActivity.class));
                break;
        }
    }
}
