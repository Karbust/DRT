package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;


import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;


import org.w3c.dom.Text;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class Viagens extends AppCompatActivity {

    private static final String TAG = "Viagens";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    private TextView de;
    private TextView para;
    private TextView tempo;
    private TextView distancia;
    private TextView passageiros;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_viagens);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        de=findViewById(R.id.textView11);
        para=findViewById(R.id.textView13);
        tempo=findViewById(R.id.textView6);
        distancia=findViewById(R.id.textView7);
        passageiros=findViewById(R.id.textView17);

        ArrayList<Viagem> aux = applicationContext.getViagens();

        de.setText(aux.get(0).getOrigem().getLOCALIDADE());
        para.setText(aux.get(0).getDestino().getLOCALIDADE());

        int minutos=aux.get(0).getDURACAO()/60;
        String time=""+minutos+"min";
        float distances=aux.get(0).getDISTANCIA()/1000;
        String distance=""+distances+"kms";
        String pessoas=""+aux.get(0).getPASSAGEIROS();

        tempo.setText(time);
        distancia.setText(distance);
        passageiros.setText(pessoas);
    }


    public void process(View view)
    {
        Intent intent=null , chooser=null;

        if(view.getId()==R.id.viagem)
        {
            float lat=applicationContext.getViagens().get(0).getDestino().getLATITUDE();
            float log=applicationContext.getViagens().get(0).getDestino().getLONGITUDE();
            String latitude=String.valueOf(lat);
            String longitude=String.valueOf(log);
            Uri gmmIntentUri=Uri.parse("google.navigation:q="+latitude+","+longitude);
            Intent mapIntent= new Intent(Intent.ACTION_VIEW,gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            startActivity(mapIntent);
        }
    }
}