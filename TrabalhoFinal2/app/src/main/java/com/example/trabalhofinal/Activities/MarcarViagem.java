package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CompoundButton;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import com.example.trabalhofinal.Api.RetrofitClient;
import com.example.trabalhofinal.Models.Domain.Location;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;
import com.google.maps.DistanceMatrixApiRequest;
import com.google.maps.GeoApiContext;
import com.google.maps.errors.ApiException;
import com.google.maps.model.Distance;
import com.google.maps.model.DistanceMatrix;
import com.google.maps.model.DistanceMatrixElement;
import com.google.maps.model.DistanceMatrixRow;
import com.google.maps.model.LatLng;
import com.google.maps.model.TravelMode;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.R.layout.simple_spinner_dropdown_item;
import static android.R.layout.simple_spinner_item;

public class MarcarViagem extends AppCompatActivity implements AdapterView.OnItemSelectedListener, View.OnClickListener, CompoundButton.OnCheckedChangeListener {

    private static final String TAG = "MarcarViagem:";
    private Spinner origem;
    private Spinner destino;
    private Spinner motivo;
    private String[] paths={"Lazer","Trabalho","Saúde nao Urgente"};
    private String motives;
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;
    private DatePickerDialog.OnDateSetListener onDateSetListener;
    private TextView data;
    private TextView tempo;
    private String data_escolhida;
    private String hora_escolhida;
    private int start;
    private int end;
    private Switch aSwitch;
    private TextView data_volta;
    private TextView tempo_volta;
    private String data_escolida_volta;
    private String hora_escolida_volta;
    private EditText passageiros;
    private EditText observacoes;
    private DistanceMatrixApiRequest distanceMatrixApiRequest;
    private float latitude_origem;
    private float longitude_origem;
    private float latitude_destino;
    private float longitude_destino;
    private String distancia = "";
    private String duracao = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_marcar_viagem);

        motivo=findViewById(R.id.spinner4);
        origem=findViewById(R.id.spinner2);
        destino=findViewById(R.id.spinner3);
        data=findViewById(R.id.nome3);
        tempo=findViewById(R.id.textView15);
        aSwitch=findViewById(R.id.switch1);
        data_volta=findViewById(R.id.nome4);
        tempo_volta=findViewById(R.id.textView46);
        passageiros=findViewById(R.id.nome2);
        observacoes=findViewById(R.id.nome5);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);



        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, simple_spinner_dropdown_item, paths);
        //set the spinners adapter to the previously created one.
        motivo.setAdapter(adapter);
        motivo.setOnItemSelectedListener(this);

        ArrayList<Location> localizacoes = applicationContext.getLocations();


        ArrayAdapter<Location> adapter1=new ArrayAdapter<Location>(this,simple_spinner_item,localizacoes);
        adapter1.setDropDownViewResource(simple_spinner_dropdown_item);
        ArrayAdapter<Location> adapter2=new ArrayAdapter<Location>(this,simple_spinner_item,localizacoes);
        adapter2.setDropDownViewResource(simple_spinner_dropdown_item);
        origem.setAdapter(adapter1);
        origem.setOnItemSelectedListener(this);
        destino.setAdapter(adapter2);
        destino.setOnItemSelectedListener(this);


        aSwitch.setOnCheckedChangeListener(this);

        findViewById(R.id.nome3).setOnClickListener(this);
        findViewById(R.id.textView15).setOnClickListener(this);
        findViewById(R.id.nome4).setOnClickListener(this);
        findViewById(R.id.textView46).setOnClickListener(this);
        findViewById(R.id.button3).setOnClickListener(this);
    }

    public void datepick(){
        Calendar cal= Calendar.getInstance();
        int ano = cal.get(Calendar.YEAR);
        int mes = cal.get(Calendar.MONTH);
        int dia = cal.get(Calendar.DAY_OF_MONTH);


        DatePickerDialog dialog = new DatePickerDialog(this, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                if(monthOfYear < 10){
                    data_escolhida = year + "-0" + (monthOfYear + 1) + "-" + dayOfMonth;
                }else{
                    data_escolhida = year + "-" + (monthOfYear + 1) + "-" + dayOfMonth;
                }
                data.setText(data_escolhida);
            }
        },ano,mes,dia);
        dialog.show();
    }

    public void datepick_volta(){
        Calendar cal= Calendar.getInstance();
        int ano = cal.get(Calendar.YEAR);
        int mes = cal.get(Calendar.MONTH);
        int dia = cal.get(Calendar.DAY_OF_MONTH);


        DatePickerDialog dialog = new DatePickerDialog(this, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                if(monthOfYear < 10){
                    data_escolida_volta = year + "-0" + (monthOfYear + 1) + "-" + dayOfMonth;
                }else{
                    data_escolida_volta =  year + "-" + (monthOfYear + 1) + "-" + dayOfMonth;
                }
                data_volta.setText(data_escolida_volta);
            }
        },ano,mes,dia);
        dialog.show();
    }

    public void timepicker(){

        final Calendar c=Calendar.getInstance();
        int horas=c.get(Calendar.HOUR_OF_DAY);
        int minutos=c.get(Calendar.MINUTE);

        TimePickerDialog timePickerDialog = new TimePickerDialog(this, new TimePickerDialog.OnTimeSetListener() {
            @Override
            public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                if(minute < 10){
                    hora_escolhida=hourOfDay + ":0" + minute;
                }else{
                    hora_escolhida=hourOfDay + ":" + minute;
                }
               tempo.setText(hora_escolhida);
            }
        },horas,minutos,true);
        timePickerDialog.show();
    }

    public void timepicker_volta(){

        final Calendar c=Calendar.getInstance();
        int horas=c.get(Calendar.HOUR_OF_DAY);
        int minutos=c.get(Calendar.MINUTE);

        TimePickerDialog timePickerDialog = new TimePickerDialog(this, new TimePickerDialog.OnTimeSetListener() {
            @Override
            public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                if(minute < 10){
                    hora_escolida_volta=hourOfDay + ":0" + minute;
                }else{
                    hora_escolida_volta=hourOfDay + ":" + minute;
                }
                tempo_volta.setText(hora_escolida_volta);
            }
        },horas,minutos,true);
        timePickerDialog.show();
    }

    private void getdados(){

        String key = getString(R.string.google_maps_key);

        GeoApiContext geoApiContext = new GeoApiContext.Builder().apiKey(key).build();
        distanceMatrixApiRequest=new DistanceMatrixApiRequest(geoApiContext);
        try {
            DistanceMatrix result = distanceMatrixApiRequest.origins(new LatLng(latitude_origem,longitude_origem)).destinations(new LatLng(latitude_destino,longitude_destino)).mode(TravelMode.DRIVING).await();
            for (DistanceMatrixRow var : result.rows)
            {
                for (DistanceMatrixElement val : var.elements)
                    {
                   distancia = String.valueOf(val.distance.inMeters);
                   duracao = String.valueOf(val.duration.inSeconds);
                }
            }
        } catch (ApiException | InterruptedException | IOException e) {
            e.printStackTrace();
        }
    }

    public boolean compareDates(String d1,String d2)
    {
        try{
            // If you already have date objects then skip 1

            //1
            // Create 2 dates starts
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            Date date1 = sdf.parse(d1);
            Date date2 = sdf.parse(d2);

            Log.i(TAG,"Date1"+sdf.format(date1));
            Log.i(TAG,"Date2"+sdf.format(date2));

            // Create 2 dates ends
            //1

            // Date object is having 3 methods namely after,before and equals for comparing
            // after() will return true if and only if date1 is after date 2
            if(date1.after(date2)){
                return true;
            }
        }
        catch(ParseException ex){
            ex.printStackTrace();
        }
        return false;
    }

    private void registo() {
        Log.i(TAG,"Passei em regist:");


        if(start == end){
            TextView errorText = (TextView)destino.getSelectedView();
            errorText.setError("");
            errorText.setText("Destino igual a origem!");
            errorText.requestFocus();
            return;
        }

        getdados();


        String pessoas=passageiros.getText().toString().trim();
        String data_hora_ida=data_escolhida+" "+hora_escolhida;
        String data_hora_volta=data_escolida_volta+" "+hora_escolida_volta;
        int nrcliente=sharedPrefManager.getUser();
        String obs=observacoes.getText().toString().trim();
        String key=sharedPrefManager.getToken();


        if(pessoas.isEmpty()){
            passageiros.setError("Em falta!");
            passageiros.requestFocus();
            return;
        }

        if(data_hora_volta != null){
            if(compareDates(data_hora_ida,data_hora_volta)){
                data_volta.setError("Data de volta tem de ser superior á de ida!");
                data_volta.requestFocus();
                return;
            }
        }



        Call<ResponseBody> call = RetrofitClient.getInstance().getApi().registoviagem(start,end,pessoas,motives,data_hora_ida,data_hora_volta,nrcliente,obs,distancia,duracao,key);
        Log.i(TAG,"Origem="+start+" Destino="+end+" NrPassageiros:"+pessoas+" Motivo:"+motives+" Ida="+data_hora_ida+ " Volta="+data_hora_volta+ " CienteNr="+nrcliente+" Observacoes="+obs+" Distancia="+distancia+" Duracao="+duracao+" Key:"+key);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                //SuccessMessageResponses successMessageResponses = response.body();
                if (response.body() != null && response.isSuccessful()) {
                    Log.i(TAG, "Request success: " + response.body());
                    Toast.makeText(getApplicationContext(),"Success" , Toast.LENGTH_LONG).show();

                } else {
                    Log.i(TAG, "Request Failed");
                    Toast.makeText(getApplicationContext(), "Failed", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i(TAG, "Request onFailure" + t);
                Toast.makeText(getApplicationContext(), "Nao foi possivel efetuar registo, por favor tente mais tarde!", Toast.LENGTH_LONG).show();
            }
        });
    }


    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        ArrayList<Location> locals = applicationContext.getLocations();
        switch (parent.getId()){
            case R.id.spinner4:
                if(position == 0){
                    motives="L";
                }else if(position == 1){
                    motives="T";
                }else if(position == 2){
                    motives="SNU";
                }
                break;
            case R.id.spinner2:
                Location location = (Location) origem.getSelectedItem();
                start=location.getNR_LOCALIDADE();
                latitude_origem=location.getLATITUDE();
                longitude_origem=location.getLONGITUDE();
                break;
            case R.id.spinner3:
                Location location1=(Location) destino.getSelectedItem();
                end=location1.getNR_LOCALIDADE();
                latitude_destino=location1.getLATITUDE();
                longitude_destino=location1.getLONGITUDE();
                break;
        }
        Log.i(TAG,"Passei em onItemSelected: "+"origem="+start+" destino="+end+ " motivo="+motives);
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {

    }


    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.nome3:
                datepick();
                break;
            case R.id.textView15:
                timepicker();
                break;
            case R.id.nome4:
                datepick_volta();
                break;
            case R.id.textView46:
                timepicker_volta();
                break;
            case R.id.button3:
               registo();
                break;
        }
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        if(aSwitch.isChecked()){
            data_volta.setVisibility(View.VISIBLE);
            tempo_volta.setVisibility(View.VISIBLE);
            data_escolida_volta=data_volta.getText().toString().trim();
            hora_escolida_volta=tempo_volta.getText().toString().trim();
        }else{
            data_volta.setVisibility(View.INVISIBLE);
            tempo_volta.setVisibility(View.INVISIBLE);
            data_volta.setText("Data Volta");
            tempo_volta.setText("Hora Volta");
            data_escolida_volta=null;
            hora_escolida_volta=null;
        }
    }
}