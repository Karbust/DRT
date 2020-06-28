package com.example.trabalhofinal;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

<<<<<<< HEAD:TrabalhoFinal2/app/src/main/java/com/example/trabalhofinal/Activities/Viagens2.java
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
=======
public class Viagens2 extends AppCompatActivity {
>>>>>>> parent of 26a9067... 28/06 20:38:TrabalhoFinal2/app/src/main/java/com/example/trabalhofinal/Viagens2.java

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_viagens2);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        findViewById(R.id.viagem2).setOnClickListener(this);
        findViewById(R.id.viagem4).setOnClickListener(this);


        TextView de = findViewById(R.id.textView43);
        TextView para = findViewById(R.id.textView44);



        de.setText(applicationContext.getViagens().get(0).getOrigem().getLOCALIDADE());
        para.setText(applicationContext.getViagens().get(0).getDestino().getLOCALIDADE());
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