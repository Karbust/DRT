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
import com.example.trabalhofinal.Models.Responses.RecuperarResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Viagens_Detalhes extends AppCompatActivity implements View.OnClickListener {

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

        int minutos = viagem.getNrViagem().getDURACAO()/60;
        String time = ""+minutos+"min";
        float distances = (float) (viagem.getNrViagem().getDISTANCIA() / 1000.00);
        String distance = ""+distances+"kms";
        String pessoas = ""+viagem.getNrViagem().getPASSAGEIROS();
        String custo = viagem.getNrViagem().getCUSTO()+"€";

        update.setText("Cancelar viagem");
        update.setVisibility(View.VISIBLE);

        tempo.setText(time);
        distancia.setText(distance);
        passageiros.setText(pessoas);
        price.setText(custo);
        update.setOnClickListener(this);
    }

    public void update(){
        int nr_viagem=viagem.getNrViagem().getNR_VIAGEM_PEDIDO();
        String key = sharedPrefManager.getToken();

        Call<RecuperarResponse> call = RetrofitClient.getInstance().getApi().atualizarestadocancelada(nr_viagem,key);
        Log.i(TAG, "Request enqueue");
        call.enqueue(new Callback<RecuperarResponse>() {
            @Override
            public void onResponse(Call<RecuperarResponse> call, Response<RecuperarResponse> response) {
                RecuperarResponse recuperarResponse = response.body();
                Log.i(TAG, "Request body" + response);
                if (response.body() != null && response.isSuccessful()) {
                    Toast.makeText(getApplicationContext(), recuperarResponse.getMessage(), Toast.LENGTH_LONG).show();
                    Intent intent = new Intent(Viagens_Detalhes.this,Viagens2.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                } else {
                    Toast.makeText(getApplicationContext(), recuperarResponse.getMessage(), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<RecuperarResponse> call, Throwable t) {
                Log.i(TAG, "Request erro");
                Log.i(TAG, "Request failure" + t);
            }
        });
    }


    public void process(View view)
    {
        Intent intent=null , chooser=null;

        if(view.getId()==R.id.viagem)
        {
            float lat = viagem.getNrViagem().getDestino().getLATITUDE();
            float log = viagem.getNrViagem().getDestino().getLONGITUDE();
            String latitude = String.valueOf(lat);
            String longitude = String.valueOf(log);
            Uri gmmIntentUri = Uri.parse("google.navigation:q="+latitude+","+longitude);
            Intent mapIntent = new Intent(Intent.ACTION_VIEW,gmmIntentUri);
            mapIntent.setPackage("com.google.android.apps.maps");
            startActivity(mapIntent);
        }

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.button4:
                if(viagem.getNrViagem().getESTADO().equals("PENDENTE") || viagem.getNrViagem().getESTADO().equals("PEDIDO")){
                    update();
                }else{
                    Toast.makeText(getApplicationContext(), "Nao foi possivel cancelar a viagem!", Toast.LENGTH_LONG).show();
                }
                break;
        }
    }
}