package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Destino;
import com.example.trabalhofinal.Models.Domain.Origem;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.Models.Responses.ViagensResponse;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;

import retrofit2.Call;
import retrofit2.Response;

public class Viagens2 extends AppCompatActivity implements View.OnClickListener, SwipeRefreshLayout.OnRefreshListener {

    private static final String TAG = "Viagens2:";
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    ProgressDialog dialog;
    SwipeRefreshLayout refreshLayout;
    AsyncTask<?, ?, ?> asyncTask;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_viagens2);

        refreshLayout = (SwipeRefreshLayout) findViewById(R.id.refresh_layout);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager = SharedPrefManager.getInstance(applicationContext);


        findViewById(R.id.viagem2).setOnClickListener(this);
        findViewById(R.id.viagem4).setOnClickListener(this);
        dialog = ProgressDialog.show(Viagens2.this, "",
                "Loading. Please wait...", true);

        new Fetchviagens().execute();

        refreshLayout.setOnRefreshListener(this);
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

    public void aftercall(){
        TextView de = findViewById(R.id.textView43);
        TextView para = findViewById(R.id.textView44);
        TextView de_data=findViewById(R.id.textView45);
        TextView de2=findViewById(R.id.textView62);
        TextView para2 = findViewById(R.id.textView64);
        TextView nomoretrips=findViewById(R.id.textView49);
        TextView data=findViewById(R.id.textView54);
        ImageView progress=findViewById(R.id.imageView35);
        TextView text_de=findViewById(R.id.textView60);
        TextView text_para=findViewById(R.id.textView63);
        TextView para_data=findViewById(R.id.textView54);
        Button direcoes=findViewById(R.id.viagem4);
        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy HH:mm");
        SimpleDateFormat before=new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        ConstraintLayout myLayout = (ConstraintLayout) findViewById(R.id.layout_viagens);
        de.setText(applicationContext.getViagens().get(0).getOrigem().getLOCALIDADE());
        para.setText(applicationContext.getViagens().get(0).getDestino().getLOCALIDADE());
        String date=parseDate(applicationContext.getViagens().get(0).getDATAHORA_IDA(),before,format);
        de_data.setText(date);

        if(applicationContext.getViagens().size() == 1){
            for ( int i = 0; i < myLayout.getChildCount();  i++ ){
                View view = myLayout.getChildAt(i);
                view.setVisibility(View.VISIBLE); // Or whatever you want to do with the view.
            }
            de2.setVisibility(View.INVISIBLE);
            para2.setVisibility(View.INVISIBLE);
            progress.setVisibility(View.INVISIBLE);
            data.setVisibility(View.INVISIBLE);
            text_de.setVisibility(View.INVISIBLE);
            text_para.setVisibility(View.INVISIBLE);
            direcoes.setVisibility(View.INVISIBLE);
        }else {
            de2.setText(applicationContext.getViagens().get(1).getOrigem().getLOCALIDADE());
            para2.setText(applicationContext.getViagens().get(1).getDestino().getLOCALIDADE());
            String date_volta=parseDate(applicationContext.getViagens().get(1).getDATAHORA_IDA(),before,format);
            para_data.setText(date_volta);
            for ( int i = 0; i < myLayout.getChildCount();  i++ ){
                View view = myLayout.getChildAt(i);
                view.setVisibility(View.VISIBLE); // Or whatever you want to do with the view.
            }
            nomoretrips.setVisibility(View.INVISIBLE);
        }
        dialog.dismiss();
    }

    @Override
    protected void onStart() {
        super.onStart();
        if (applicationContext.getViagens() == null) {
            //fetchviagens();
        } else {
            TextView de = findViewById(R.id.textView43);
            TextView para = findViewById(R.id.textView44);
            de.setText(applicationContext.getViagens().get(0).getOrigem().getLOCALIDADE());
            para.setText(applicationContext.getViagens().get(0).getDestino().getLOCALIDADE());
        }
    }
    
    public ArrayList<Viagem> fetchviagens() {
        int user = sharedPrefManager.getUser();
        String key = sharedPrefManager.getToken();

        ArrayList<Viagem> viagens;

        Call<ViagensResponse> call = RetrofitClient.getInstance().getApi().viagens(user, key);
        try {
            Response<ViagensResponse> viagensResponse = call.execute();
            if (viagensResponse.body() != null && viagensResponse.isSuccessful()) {

                Log.i(TAG, "Request Successful");
                viagens = viagensResponse.body().getViagens();
            } else {
                Log.i(TAG, "Request Failed");
                dialog.dismiss();
                viagens=null;
            }
        } catch (IOException e) {
            e.printStackTrace();
            Log.i(TAG, "Request erro");
            Log.i(TAG, "Request failure");
            viagens=null;
        }

        return viagens;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.viagem2:
            case R.id.viagem4:
                startActivity(new Intent(Viagens2.this, Viagens.class));
                break;
        }
    }

    @Override
    public void onRefresh() {
        Log.i(TAG, "onRefresh called from SwipeRefreshLayout");
        dialog = ProgressDialog.show(Viagens2.this, "",
                "Loading. Please wait...", true);
        new Fetchviagens().execute();

        // This method performs the actual data-refresh operation.
        // The method calls setRefreshing(false) when it's finished.
    }

    private final class Fetchviagens extends AsyncTask<Void, Void, ArrayList<Viagem>> {

        @Override
        protected ArrayList<Viagem> doInBackground(Void... params) {

            ArrayList<Viagem> viagens = fetchviagens();

            if(viagens == null) return null;

            ArrayList<Viagem> viagens1 = (ArrayList<Viagem>) viagens.clone();

            for (Viagem var : viagens1)
            {
                if(var.getDATAHORA_VOLTA() != null){
                    Destino destiny = new Destino(var.getOrigem().getLOCALIDADE(),var.getOrigem().getLATITUDE(),var.getOrigem().getLONGITUDE());
                    Origem origin = new Origem(var.getDestino().getLOCALIDADE(),var.getDestino().getLATITUDE(),var.getDestino().getLONGITUDE());
                    Viagem trip = new Viagem(var.getDATAHORA_VOLTA(),var.getDISTANCIA(),var.getDURACAO(),var.getPASSAGEIROS(),origin,destiny,var.getCUSTO(),null);
                    viagens.add(trip);
                }
            }

            Collections.sort(viagens, new Comparator<Viagem>() {
                @Override
                public int compare(Viagem o1, Viagem o2) {
                    try {
                        return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(o1.getDATAHORA_IDA()).compareTo(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(o2.getDATAHORA_IDA()));
                    }catch (ParseException e){
                        return 0;
                    }
                }
            });

            return viagens;
        }

        @Override
        protected void onPostExecute(ArrayList<Viagem> result) {
            applicationContext.setViagens(result);
            if(refreshLayout.isRefreshing()){
                refreshLayout.setRefreshing(false);
            }
            aftercall();
        }
    }
}