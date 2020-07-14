package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;

import com.example.trabalhofinal.Models.Domain.Notificacoes;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.Utils.RecycleViewAdapterNotificacoes;
import com.example.trabalhofinal.Utils.RecyclerViewAdapter;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.util.ArrayList;

public class NotificacoesActivity extends AppCompatActivity {

    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    RecyclerView recyclerView;
    RecycleViewAdapterNotificacoes recyclerViewAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notificacoes);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        ArrayList<Notificacoes> notificacoes = applicationContext.getNotificacoes();
        recyclerView = findViewById(R.id.recycleview_notificacoes);

        recyclerViewAdapter = new RecycleViewAdapterNotificacoes(notificacoes);
        recyclerView.setAdapter(recyclerViewAdapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

    }
}