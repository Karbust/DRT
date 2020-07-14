package com.example.trabalhofinal.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import com.example.trabalhofinal.Models.Domain.Stats;
import com.example.trabalhofinal.Models.Domain.Viagem;
import com.example.trabalhofinal.R;
import com.example.trabalhofinal.storage.ApplicationContext;
import com.example.trabalhofinal.storage.SharedPrefManager;
import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.Description;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.formatter.ValueFormatter;
import com.github.mikephil.charting.interfaces.datasets.IBarDataSet;

import java.util.ArrayList;
import java.util.Collections;

public class Estatistica extends AppCompatActivity {

    BarChart barChart;
    private ApplicationContext applicationContext;
    private SharedPrefManager sharedPrefManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_estatistica);

        applicationContext = (ApplicationContext) getApplicationContext();
        sharedPrefManager=  SharedPrefManager.getInstance(applicationContext);

        barChart = findViewById(R.id.barchart);

        ArrayList<BarEntry> barEntries = new ArrayList<>();

        ArrayList<Stats> stats = applicationContext.getStats();
        float aux=0;
        int aux1=0;
        String[] meses = new String[13];

        for(Stats var: stats){
            barEntries.add(new BarEntry(aux,var.getCount()));
            meses[aux1] = var.getDatas();
            aux1++;
            aux++;
        }

        BarDataSet barDataSet = new BarDataSet(barEntries,"Meses");

        BarData theData = new BarData(barDataSet);

        ValueFormatter formatter = new ValueFormatter() {
            @Override
            public String getAxisLabel(float value, AxisBase axis) {
                return meses[(int) value];
            }
        };

        Legend legend = barChart.getLegend();
        legend.setEnabled(false);

        XAxis xAxis = barChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setGranularity(1f);
        xAxis.setValueFormatter(formatter);

        barChart.getAxisLeft().setAxisMinimum(0);
        barChart.getAxisRight().setAxisMinimum(0);

        Description description = barChart.getDescription();
        description.setEnabled(false);

        theData.setBarWidth(0.9f);
        barChart.setData(theData);
        barChart.setFitBars(true);
        barChart.invalidate();

        barChart.setData(theData);
    }
}