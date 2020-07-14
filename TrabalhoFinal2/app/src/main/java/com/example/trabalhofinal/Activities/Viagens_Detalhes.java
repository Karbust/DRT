package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.trabalhofinal.Activities.Viagens;
import com.example.trabalhofinal.Activities.Viagens2;
import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Domain.ViagensMotorista;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Viagens_Detalhes extends AppCompatActivity  {

    private static final String TAG = "Viagens_Detalhes";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    private TextView de;
    private TextView para;
    private TextView tempo;
    private TextView distancia;
    private TextView passageiros;
    private TextView price;
    private Viagem viagem;
    private Button update;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_viagens__detalhes);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        de=findViewById(R.id.textView11);
        para=findViewById(R.id.textView13);
        tempo=findViewById(R.id.textView6);
        distancia=findViewById(R.id.textView7);
        passageiros=findViewById(R.id.textView17);
        price=findViewById(R.id.textView51);
        update=findViewById(R.id.button4);


        viagem = (Viagem) getIntent().getSerializableExtra("VIAGEM_DETALHES");

        de.setText(viagem.getNrViagem().getOrigem().getLOCALIDADE());
        para.setText(viagem.getNrViagem().getDestino().getLOCALIDADE());

        int minutos=viagem.getNrViagem().getDURACAO()/60;
        String time=""+minutos+"min";
        float distances=viagem.getNrViagem().getDISTANCIA()/1000;
        String distance=""+distances+"kms";
        String pessoas=""+viagem.getNrViagem().getPASSAGEIROS();

        if(sharedPrefManager.getUser() == 5){
            update.setVisibility(View.VISIBLE);
        }

        tempo.setText(time);
        distancia.setText(distance);
        passageiros.setText(pessoas);
        price.setText(viagem.getNrViagem().getCUSTO());
    }


    public void process(View view)
    {
        Intent intent=null , chooser=null;

        if(view.getId()==R.id.viagem)
        {
            float lat=viagem.getNrViagem().getDestino().getLATITUDE();
            float log=viagem.getNrViagem().getDestino().getLONGITUDE();
            String latitude=String.valueOf(lat);
            String longitude=String.valueOf(log);
            Uri gmmIntentUri=Uri.parse("google.navigation:q="+latitude+","+longitude);
            Intent mapIntent= new Intent(Intent.ACTION_VIEW,gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            startActivity(mapIntent);
        }
    }

}