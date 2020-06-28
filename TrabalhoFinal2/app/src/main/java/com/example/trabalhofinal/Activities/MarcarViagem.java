package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.TimePicker;

import com.example.trabalhofinal.Models.Domain.Location;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

import static android.R.layout.simple_spinner_dropdown_item;

public class MarcarViagem extends AppCompatActivity implements AdapterView.OnItemSelectedListener, View.OnClickListener {

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_marcar_viagem);

        motivo=findViewById(R.id.spinner4);
        origem=findViewById(R.id.spinner2);
        destino=findViewById(R.id.spinner3);
        data=findViewById(R.id.nome3);
        tempo=findViewById(R.id.textView15);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        ArrayList<Location> localizacoes = applicationContext.getLocations();

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, simple_spinner_dropdown_item, paths);
        //set the spinners adapter to the previously created one.
        motivo.setAdapter(adapter);
        motivo.setOnItemSelectedListener(this);

        List<String> locations = localizacoes.stream().map(location -> location.getLOCALIDADE()).collect(Collectors.toList());
        ArrayAdapter<String> adapter1 = new ArrayAdapter<>(this, simple_spinner_dropdown_item, locations);
        //set the spinners adapter to the previously created one.
        origem.setAdapter(adapter1);
        origem.setOnItemSelectedListener(this);
        destino.setAdapter(adapter1);
        destino.setOnItemSelectedListener(this);

        findViewById(R.id.nome3).setOnClickListener(this);
        findViewById(R.id.textView15).setOnClickListener(this);
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
                    data_escolhida=dayOfMonth + "-0" + (monthOfYear + 1) + "-" + year;
                }else{
                    data_escolhida=dayOfMonth + "-" + (monthOfYear + 1) + "-" + year;
                }
                data.setText(data_escolhida);
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

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        switch (position){
            case 0:
                motives="L";
                break;
            case 1:
                motives="T";
                break;
            case 2:
                motives="SNU";
                break;
        }
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
        }
    }
}