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

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Domain.ViagensMotorista;
import com.example.trabalhofinal.Models.Responses.LocationsResponse;
import com.example.trabalhofinal.Models.Responses.LoginResponse;
import com.example.trabalhofinal.Models.Responses.SuccessMessageResponses;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;


import org.w3c.dom.Text;

import java.util.ArrayList;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class Viagens extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "Viagens";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    private TextView de;
    private TextView para;
    private TextView tempo;
    private TextView distancia;
    private TextView passageiros;
    private TextView price;
    private ViagensMotorista viagem;
    private Button update;

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
        price=findViewById(R.id.textView51);
        update=findViewById(R.id.button4);

        viagem = (ViagensMotorista) getIntent().getSerializableExtra("VIAGEM_DETALHES");

        de.setText(viagem.getOrigem().getLOCALIDADE());
        para.setText(viagem.getDestino().getLOCALIDADE());

        int minutos=viagem.getDURACAO()/60;
        String time=""+minutos+"min";
        float distances = viagem.getDISTANCIA()/1000;
        String distance=""+distances+"kms";
        String pessoas=""+viagem.getPASSAGEIROS();


        update.setVisibility(View.VISIBLE);

        if(viagem.getESTADO().equals("DECORRER_IDA" )|| viagem.getESTADO().equals("DECORRER_VOLTA")){
            update.setText("Finalizar Viagem");
        }

        tempo.setText(time);
        distancia.setText(distance);
        passageiros.setText(pessoas);
        price.setText(viagem.getCUSTO());


        update.setOnClickListener(this);
    }

    public void process(View view)
    {
        Intent intent=null , chooser=null;

        if(view.getId()==R.id.viagem)
        {
            float lat=viagem.getDestino().getLATITUDE();
            float log=viagem.getDestino().getLONGITUDE();
            String latitude=String.valueOf(lat);
            String longitude=String.valueOf(log);
            Uri gmmIntentUri=Uri.parse("google.navigation:q="+latitude+","+longitude);
            Intent mapIntent= new Intent(Intent.ACTION_VIEW,gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            startActivity(mapIntent);
        }
    }

    public void update(String update_estado){
        int nr_viagem=viagem.getNR_VIAGEM_PEDIDO();
        String key = sharedPrefManager.getToken();

        Call<ResponseBody> call = RetrofitClient.getInstance().getApi().estadoUpdate(nr_viagem,update_estado,key);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                Log.i(TAG, "Request body" + response);
                if (response.body() != null && response.isSuccessful()) {

                } else {

                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure" + t);
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.button4:
                Log.i(TAG,"Estado:"+viagem.getESTADO());
                if(viagem.getESTADO().equals("PENDENTE")){
                    update("DECORRER_IDA");
                    viagem.setESTADO("DECORRER_IDA");
                    update.setText("Finalizar Viagem");
                    Toast.makeText(getApplicationContext(), "Viagem Inicializada!", Toast.LENGTH_LONG).show();
                }else if(viagem.getESTADO().equals("DECORRER_IDA")){
                    update("PENDENTE_VOLTA");
                    Intent intent=new Intent(Viagens.this,ViagensMotoristaActivity.class);
                    startActivity(intent);
                    Toast.makeText(getApplicationContext(), "Viagem Finalizada!", Toast.LENGTH_LONG).show();
                }else if(viagem.getESTADO().equals("PENDENTE_VOLTA")){
                    update("DECORRER_VOLTA");
                    viagem.setESTADO("DECORRER_VOLTA");
                    update.setText("Finalizar Viagem");
                    Toast.makeText(getApplicationContext(), "Viagem Inicializada!", Toast.LENGTH_LONG).show();
                }else if(viagem.getESTADO().equals("DECORRER_VOLTA")){
                    update("CONCLUIDA");
                    Intent intent=new Intent(Viagens.this,ViagensMotoristaActivity.class);
                    startActivity(intent);
                    Toast.makeText(getApplicationContext(), "Viagem Finalizada!", Toast.LENGTH_LONG).show();
                }
                break;
        }
    }
}